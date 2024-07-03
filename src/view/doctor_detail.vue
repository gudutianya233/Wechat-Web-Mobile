<!-- 医生详情页面 -->
<script lang="ts" setup>
//import Editor from "@tinymce/tinymce-vue"
import { ElMessage } from 'element-plus';
import { DoctorInfo } from '../entities/doctor/doctor_info.entities';
import {
    getDoctorAllInformation, checkIfUserFollowsDoctor, getUserId,
    userFollowDoctor, userCancellationFollowDoctor, getUserEvaluateWeChat, getUserEvaluateWeChatCount, getDoctorWorkTime, getDoctorWorkId
} from '../request/doctor_detail';

import { UserEvaluate } from '../entities/user/user_evaluate.entities';
import { WorkTime } from '../entities/doctor/work_time.entities';
import { Splide, SplideSlide } from "@splidejs/vue-splide";
const router = useRouter();
const route = useRoute();
const isExpanded = ref(false);//用一个变量来控制医生的成就是否完全显示
const isExpanded_ProficientTreatment = ref(false);//用一个变量来控制医生的擅长治疗是否完全显示
const isExpanded_overview_content = ref(false);//用一个变量来控制医生的个人简介是否完全显示

//根据isExpanded的值来切换成就div的class样式
function toggle() {
    isExpanded.value = !isExpanded.value;
}
//根据isExpanded_ProficientTreatment的值来切换擅长治疗div的class样式
function toggle_ProficientTreatment() {
    isExpanded_ProficientTreatment.value = !isExpanded_ProficientTreatment.value;
}
//根据isExpanded_ProficientTreatment的值来切换医生简介div的class样式
function toggle_overview_content() {
    isExpanded_overview_content.value = !isExpanded_overview_content.value;
}


//荣誉图片查看大图
const showModal = ref(false);
const modalImageUrl = ref('');
function showImage(url: string) {
    showModal.value = true;
    modalImageUrl.value = url;
}
function closeImage() {
    showModal.value = false;
}
const openid = window.localStorage.getItem('openid');
//医生id
let id: string
let doctorInformation: Ref<DoctorInfo | null> = ref(null)
let follow = ref(false) // 是否关注此医生(false未关注，true关注)
let isRequested = false //用一个变量来保证只发起一次请求，防止因为dom变化而导致重复请求
let userId: number

//评价的用户头像
const headUrl = ref('http://localhost:3000/public/uploads/2023-8-23/avatar.png')

//当前的医生通过的评价总条数
const conuts = ref(0)
//评价是否已经显示完
const show_see_mode = ref(true)
//跳过的记录数目
let skip = 0
//每次获得5条
let take = 5
//得到的评价数据
const userEvaluateList: Ref<UserEvaluate[] | null> = ref(null)


//未关注此医生，点击关注此医生
async function prepare_follow() {
    console.log(openid);
    console.log(doctorInformation.value);

    if (doctorInformation.value && openid) {

        const res = await userFollowDoctor(userId, doctorInformation.value.doctor.id, openid);
        console.log(res);
        if (res) {
            follow.value = true
            ElMessage({
                message: `关注${doctorInformation.value.doctor.name}医生成功`,
                type: 'success',
            })
        }
    }
    else {
        ElMessage({
            message: `关注医生失败,请联系客服人员`,
            type: 'error',
        })
    }

}

//已关注此医生，点击取消关注此医生
async function cancellation_follow() {
    if (doctorInformation.value) {
        const res = await userCancellationFollowDoctor(userId, doctorInformation.value.doctor.id);
        if (res) {
            follow.value = false
            ElMessage({
                message: `取消关注${doctorInformation.value.doctor.name}医生成功`,
                type: 'success',
            })
        }
    }

}
//切换医生的预约挂号，医生简介，医生荣誉时，默认选择挂号选项
const activeName = ref('first')

//评价的html渲染的数据中，名字进行加密
const encryptedUserEvaluateList = computed(() => {
    if (userEvaluateList.value) {
        return userEvaluateList.value.map(item => ({
            id: item.id,
            evaluate_name: encryptName(item.evaluate_name),
            stars: item.stars,
            content: item.content,
            create_time: item.create_time
        }))
    }
});
//除姓氏外，其余字都变成*
function encryptName(name: string) {
    if (name.length > 1) {
        return name[0] + '*'.repeat(name.length - 1);
    } else {
        return name;
    }
}
//查看更多评价
function see_more() {
    // 增加 skip 参数的值
    skip += take;
    // 获取更多的评价
    getUserEvaluateWeChat(skip, take, id).then((res: any) => {
        if (res) {
            //  console.log(res)
            // 将新获取的公告添加到列表中
            if (userEvaluateList.value != null) {
                userEvaluateList.value = [...userEvaluateList.value, ...res.userEvaluates];
            }
            // 如果返回的参数hasMore为true，表示还有数据，为false则已经查询完所有公告了，则隐藏“查看更多”按钮
            if (!res.hasMore) {
                show_see_mode.value = false;
            }
        }
    });
}

//当前医生的出诊时间
const workTime: Ref<WorkTime[] | null> = ref(null)
async function getWorkTime() {
    const doctorId = id
    const doctorWorkId = await getDoctorWorkId(doctorId)
    const res = await getDoctorWorkTime(doctorId, doctorWorkId)
    //console.log(res)
    if (res) {
        workTime.value = res
        console.log('workTime', workTime.value)
    }
}
// 定义一个computed属性，用来过滤掉过期的时间
const filterworkTime = computed(() => {
    if (workTime.value) {
        return workTime.value.map(item => {
            // 将work_time转换为Date对象
            const workDate = new Date(item.work_time);
            // 获取当前的日期
            const today = new Date();
            // 将workDate和today都转换为yyyy-mm-dd格式的字符串
            const workDateString = workDate.toISOString().slice(0, 10);
            const todayString = today.toISOString().slice(0, 10);
            // 使用localeCompare方法比较两个字符串的大小
            const isExpired = workDateString.localeCompare(todayString) < 0; // 注意这里使用了<符号
            // 判断是否过期
            if (isExpired) {
                // 如果过期了，返回null
                return null;
            } else {
                // 如果没有过期，返回原始的item
                return item;
            }
        }).filter(item => {
            // 过滤掉null值
            return item !== null;
        });
    }
});

// 创建一个新的数组，用来存放今天和未来29天的日期数据
const workTimes = ref<WorkTime[]>(Array.from({ length: 30 }));
// 定义一些常量或者参数
let doctorId = 0
let doctorWorkId = '0'
let name = '';
if (workTime.value) {
    doctorId = workTime.value[0].doctorId
    name = workTime.value[0].name
}
// 定义一个变量，用来记录当前的id值
let currentId = 1;
// function newWorkTimes() {
//     // 遍历这个新数组
//     for (let i = 0; i < workTimes.value.length; i++) {
//         // 创建一个WorkTime类型的对象
//         let workTime: WorkTime = {
//             id: currentId, // 使用当前的id值
//             doctorId: doctorId, // 使用医生id
//             name: name, // 使用医生名字
//             doctorWorkId: doctorWorkId, // 使用医生的排班安排表id
//             create_time: new Date().toISOString(), // 使用当前时间
//             update_time: new Date().toISOString(), // 使用当前时间
//             work_time: "", // 先留空，后面再赋值
//             status: 0, // 默认值0
//             register_number:0
//         };
//         // 获取当前的日期
//         let currentDate = new Date();
//         // 设置日期为今天加上i天
//         currentDate.setDate(currentDate.getDate() + i);
//         // 获取yyyy-mm-dd格式的字符串
//         let workDateString = currentDate.toISOString().slice(0, 10);
//         // 赋值给work_time属性
//         workTime.work_time = workDateString;
//         //赋值给register_number属性
//         workTime.register_number=workTimes.value[i].register_number
//         // 将这个WorkTime类型的对象赋值给新数组中对应的元素
//         workTimes.value[i] = workTime;

//         // 将当前的id值递增
//         currentId++;
//     }
//     // 判断filterworkTime.value是否是一个数组
//     if (Array.isArray(filterworkTime.value)) {
//         // 使用for...of循环或者其他任何数组的遍历方法
//         for (let item of filterworkTime.value) {
//             // 判断item是否为null
//             if (item === null) {
//                 // 如果是，跳过该元素
//                 continue;
//             }
//             // 找到workTimes数组中日期匹配的元素的索引
//             // 使用workTimes.value来获取数组的值
//             if (workTimes.value) {
//                 let index = workTimes.value.findIndex(wt => wt.work_time === item?.work_time);
//                 // 如果找到了索引
//                 if (index !== -1 && workTimes.value) {
//                     // 将workTimes数组中的元素替换为filterworkTime数组中的元素
//                     workTimes.value[index] = item;
//                 }
//             }
//         }
//     }
// }
function newWorkTimes() {
    // 遍历这个新数组
    for (let i = 0; i < workTimes.value.length; i++) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        let workDateString = currentDate.toISOString().slice(0, 10);
        let workTime;
        if (filterworkTime.value) {
            workTime = filterworkTime.value.find(wt => wt && wt.work_time === workDateString);
        }
        if (!workTime) {
            workTime = {
                id: currentId,
                doctorId: doctorId,
                name: name,
                doctorWorkId: doctorWorkId,
                create_time: new Date().toISOString(),
                update_time: new Date().toISOString(),
                work_time: workDateString,
                status: 0,
                register_number: 0
            };
            currentId++;
        }
        workTimes.value[i] = workTime;
    }
}



// 定义一个函数，根据日期字符串返回周几
function getWeekday(work_time: string) {
    // 创建一个Date对象
    let d = new Date(work_time);
    // 获取星期的数字，0表示周日，1表示周一，以此类推
    let weekday = d.getDay();
    // 定义一个数组，存储星期的中文
    let weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    // 返回对应的星期
    return weekdays[weekday];
}

// 定义一个函数，根据日期字符串返回月-日
function getMonthDay(work_time: string) {
    // 创建一个Date对象
    let d = new Date(work_time);
    // 获取月份，0表示一月，1表示二月，以此类推
    let month = d.getMonth() + 1;
    // 获取日期
    let day = d.getDate();
    // 如果月份或日期小于10，前面补0
    if (month < 10) {
        month = + "0" + month;
    }
    if (day < 10) {
        day = +  "0" + day;
    }
    // 返回月-日的格式
    return month + "-" + day;
}
//跳转到挂号详情
function user_register(work_time: string, status: number, register_number: number) {
    if (register_number > 0) {
        const appointment = new Date(work_time);
        let now = new Date();
        let deadline;
        if (status === 2) { // 上午
            deadline = new Date(appointment);
            deadline.setHours(11, 40, 0); // 设置截止时间为11:40
            if (now > deadline && now.toISOString().slice(0, 10) === work_time) {
                ElMessage({
                    message: `已经超过挂号时间11:40`,
                    type: 'error',
                })
                return;
            }
        } else if (status === 3) { // 下午
            deadline = new Date(appointment);
            deadline.setHours(17, 10, 0); // 设置截止时间为17:10
            if (now > deadline && now.toISOString().slice(0, 10) === work_time) {
                ElMessage({
                    message: `已经超过挂号时间17:10`,
                    type: 'error',
                })
                return;
            }
        }
        const doctorId = id
        router.push({ name: 'user_register', query: { userId, doctorId, work_time, status } });
    }
    else {
        ElMessage({
            message: `当日号数已挂完,加号,请联系工作人员`,
            type: 'error',
        })
    }
}


// 创建两个轮播引用
const splide1 = ref<Splide>(null);
const splide2 = ref<Splide>(null);
// 定义一个变量，存储当前选中的轮播图的索引
// router.afterEach(() => {
//     // 当我的页面路由发生变化，删除sessionStorage
//     sessionStorage.removeItem('isReloaded');
// })
onMounted(async () => {
    if (!isRequested) {
        isRequested = true
        if (openid) {
            if (typeof route.query.id === 'string') {
                id = route.query.id
            }
            userId = await getUserId(openid)
        }

        // console.log(id)
        if (id) {
            //获得当前医生的详细信息
            const res = await getDoctorAllInformation(id)
            // console.log(res)     
            if (res) {
                doctorInformation.value = res
                console.log(doctorInformation)
            }
            //先获得5条评价
            const ress: any = await getUserEvaluateWeChat(skip, take, id)
            userEvaluateList.value = ress.userEvaluates
            console.log(userEvaluateList.value)

            //获得评价总数
            const resss: number = await getUserEvaluateWeChatCount(id)
            conuts.value = resss
        }

        if (doctorInformation.value) {
            const doctorId = doctorInformation.value.doctor.id
            //根据userId，doctorId查询是否关注此医生
            const isFollow = await checkIfUserFollowsDoctor(userId, doctorId)
            //console.log(doctorInformation.value)
            follow.value = isFollow
        }
    }
    //获得数据库的排班时间
    await getWorkTime()
    console.log('filterworkTime', filterworkTime)
    //把排班时间过滤后重新赋值
    await newWorkTimes()
    console.log('workTimes', workTimes)
   await nextTick(() => {
        // 获取两个轮播实例
        const splide1Instance = splide1.value.splide;
        const splide2Instance = splide2.value.splide;
        // 同步 splide2 到 splide1(2个轮播联动)
        splide1Instance.sync(splide2Instance);
        // 监听第一个轮播的 click 事件
        splide1Instance.on('click', function (slide: any) {
            // 获取点击的幻灯片的索引
            const index = slide.index;
            // 切换第二个轮播到对应的索引
            splide2Instance.go(index);
        });
    });
})
//时间戳秒转换成yyyy-mm-dd格式
function timestampToDateString(timestamp: string) {
    const date = new Date(Number(timestamp) * 1000);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份从0开始，所以需要+1
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
</script>
<template>
    <div class="div_doctor_info_top">
        <div class="div_doctor_info">
            <div class="div_doctor_info_headPicture">
                <img :src="doctorInformation?.doctor.head__picture" />
            </div>
            <div class="div_doctor_achievement" @click="toggle"
                v-bind:class="{ expanded: isExpanded, 'more': !isExpanded }">
                <div><span style="font-size: 1.5rem;">{{ doctorInformation?.doctor.name }}</span></div>
                <div><span style="font-size: 1.2rem;">{{ doctorInformation?.doctor.title }}</span></div>
                <div v-for="item in doctorInformation?.doctorAchievement" :key="item.id">
                    <span>{{ item.title }}</span>
                </div>
            </div>
            <div class="div_doctor_follow">
                <div class="div_doctor_follow_main">
                    <div v-if="follow" @click="cancellation_follow">已关注</div>
                    <div v-else @click="prepare_follow">未关注</div>
                </div>
            </div>
        </div>
        <div class="div_doctor_introduction">
            <div class="div_doctor_main_overview_content" @click="toggle_overview_content" style="color: white;"
                v-bind:class="{ expanded_ProficientTreatment: isExpanded_overview_content, 'more_overview_content': !isExpanded_overview_content }">
                <span>{{ doctorInformation?.doctor.overview_content }}</span>
            </div>
        </div>
        <div class="Divider"></div>
        <div class="div_doctor_ProficientTreatment" @click="toggle_ProficientTreatment"
            v-bind:class="{ expanded_ProficientTreatment: isExpanded_ProficientTreatment, 'more_ProficientTreatment': !isExpanded_ProficientTreatment }">
            <div v-for="item in doctorInformation?.doctorProficientTreatment" :key="item.id">
                <div class="div_doctor_ProficientTreatment_name">{{ item.subjects }}：{{ item.proficient_treatment }}</div>
            </div>
        </div>
        <div class="div_doctor_data">
            <div class="div_doctor_receive_number">
                <div class="div_doctor_data_border">
                    <div>
                        <span>挂号量</span>
                    </div>
                    <div>
                        <span>{{ doctorInformation?.doctor.receive_number }}</span>
                    </div>
                </div>
            </div>
            <div class="div_doctor_attention">
                <div class="div_doctor_data_border">
                    <div>
                        <span>关注度</span>
                    </div>
                    <div>
                        <span>{{ doctorInformation?.doctor.attention }}</span>
                    </div>
                </div>
            </div>
            <div class="div_doctor_favorable_rate">
                <div class="div_doctor_data_border">
                    <div>
                        <span>好评率</span>
                    </div>
                    <div>
                        <span>{{ doctorInformation?.doctor.favorable_rate }}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="div_doctor_main">
        <el-tabs v-model="activeName" class="doctor-tabs" :stretch="true">
            <el-tab-pane label="预约挂号" name="first">
                <Splide class="splide1" ref="splide1" type="slide"
                    :options="{ rewind: true, pagination: false, autoWidth: true, autoHeight:false, arrows: false, perPage: 7, direction: 'ltr', type: 'slide' }">
                    <SplideSlide v-for="(item, index) in workTimes" :key="index">
                        <div class="times">
                            <div class="times_week" v-if="item">{{ getWeekday(item.work_time) }}</div>
                            <div class="times_day" v-if="item">{{ getMonthDay(item.work_time) }}</div>
                        </div>
                    </SplideSlide>
                </Splide>
                <Splide class="splide2" ref="splide2" type="slide"
                    :options="{ rewind: true, pagination: false, autoWidth: true, arrows: false, perPage: 1, direction: 'ltr', type: 'slide' }">
                    <SplideSlide v-for="(item, index) in workTimes" :key="index">
                        <div class="status">
                            <div class="status_one">
                                <div class="status_day" v-if="item">{{ getMonthDay(item.work_time) }}</div>
                                <div></div>
                                <div class="status_week" v-if="item">{{ getWeekday(item.work_time) }}</div>
                            </div>
                            <div class="status_two">
                                <div class="status_two_status">
                                    <div v-if="item?.status == 0">
                                        <div style="border-bottom: 1px #752423 solid;">
                                            <span>上午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button type="info"
                                                disabled>满号</el-button>
                                        </div>
                                        <div>
                                            <span>下午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button type="info"
                                                disabled>满号</el-button>
                                        </div>
                                    </div>

                                    <div v-if="item?.status == 1">
                                        <div style="border-bottom: 1px #752423 solid;">
                                            <span>上午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button color="#752423"
                                                @click="user_register(item.work_time, 2, item.register_number)"
                                                type="success">挂号</el-button>
                                        </div>
                                        <div>
                                            <span>下午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button color="#752423"
                                                @click="user_register(item.work_time, 3, item.register_number)"
                                                type="success">挂号</el-button>
                                        </div>
                                    </div>

                                    <div v-if="item?.status == 2">
                                        <div style="border-bottom: 1px #752423 solid;">
                                            <span>上午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button color="#752423"
                                                @click="user_register(item.work_time, 2, item.register_number)"
                                                type="success">挂号</el-button>
                                        </div>
                                        <div>
                                            <span>下午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button type="info"
                                                disabled>满号</el-button>
                                        </div>
                                    </div>

                                    <div v-if="item?.status == 3">
                                        <div style="border-bottom: 1px #752423 solid;">
                                            <span>上午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button type="info"
                                                disabled>满号</el-button>
                                        </div>
                                        <div>
                                            <span>下午</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<el-button color="#752423"
                                                @click="user_register(item.work_time, 3, item.register_number)"
                                                type="success">挂号</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SplideSlide>
                </Splide>
            </el-tab-pane>
            <el-tab-pane label="医生简介" name="second">
                <div class="div_doctor_main_overview_content" @click="toggle_overview_content"
                    v-bind:class="{ expanded_ProficientTreatment: isExpanded_overview_content, 'more_overview_content': !isExpanded_overview_content }">
                    <span>{{ doctorInformation?.doctor.overview_content }}</span>
                </div>
            </el-tab-pane>
            <el-tab-pane label="医生荣誉" name="third">
                <div class="div_doctor_main_honor">
                    <div class="div_doctor_main_honor_img" v-for="item in doctorInformation?.doctorHonor"
                        @click="showImage(item.url)" :key="item.id">
                        <img :src="item.url" />
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <!-- <div class="div_medicine_knowledge">
        <div class="div_medicine_knowledge_head">
            <div class="div_medicine_knowledge_head_title">中医小知识</div>
            <div class="div_medicine_knowledge_head_more">更多&nbsp》</div>
        </div>
        <div class="div_medicine_knowledge_body">
            <div class="div_medicine_knowledge_image">
                <img src=""/>
            </div>
            <div class="div_medicine_knowledge_content">

            </div>
        </div>
    </div> -->
    <div class="evaluate">
        <div class="evaluate_title">
            <div>医生评价&nbsp({{ conuts }})&nbsp条</div>
            <div></div>
        </div>
        <div class="evaluate_main">
            <div class="evaluate_mains" v-for="item in encryptedUserEvaluateList" :key="item.id">
                <div class="evaluate_mains_title">
                    <div class="evaluate_headUrl">
                        <img :src="headUrl" />
                    </div>
                    <div class="evaluate_name">
                        <span>{{ item.evaluate_name }}</span>
                    </div>
                    <div class="evaluate_rate">
                        <span> <el-rate v-model="item.stars" size="small" disabled /></span>
                    </div>
                </div>
                <div class="evaluate_mains_content">
                    <span>{{ item.content }}</span>
                </div>
                <div class="evaluate_mains_time">
                    <span>{{ timestampToDateString(item.create_time) }}</span>
                </div>
            </div>
        </div>
    </div>
    <div>
        <See_more v-if="show_see_mode" @click="see_more"></See_more>
    </div>
    <div v-if="showModal" class="modal">
        <img :src="modalImageUrl" alt="大图" @click="closeImage" />
    </div>
    <div>
    </div>
</template>
<style lang="less" scoped>
/* 设置活动幻灯片的背景颜色为蓝色 */
.splide1 .is-active {
    color: white;
    background-color: #752423;
}

.splide1 {
    padding-top:1rem;
    padding-bottom:1rem;
    width: 90%;
    margin: auto;
    border: #752423 1px solid;
    overflow: hidden;
    z-index: 999;
    padding-left: 0.6rem;
}

.splide2 {
    margin-top: 1rem;
    height: 7.5rem;
    overflow: hidden;
    .splide__list li{
        width: 100%;
    }
}

.status {
    margin-left: 1rem;
    margin-right: 1rem;
    display: flex;
    height: 6rem;
}

.status_one {
    background-color: #fff;
    width: 30%;
    text-align: center;
    border-radius: 2rem 0 0 2rem;
    line-height: 4rem;
    display: flex;
    flex-direction: column;
    border-right: 1px #752423 solid;

    .status_day {
        height: 30%;
    }
}

.status_two {
    background-color: #ffffff;
    width: 70%;
    text-align: center;
    border-radius: 0 2rem 2rem 0;
    line-height: 3rem;
}

.times {
    width: 3.6rem;
}



:deep(.splide__list) {
    display: flex;
    padding: 0;
    list-style: none;
    margin-top: 1rem;
}

.div_doctor_info_top {
    width: 100%;
    background-color: #752423;
    padding-top: 1rem;
    padding-bottom: 0.5rem;
    display: flex;
    flex-direction: column;

    .div_doctor_info {
        display: flex;
        padding-bottom: 0.5rem;

        .div_doctor_achievement {
            text-align: left;
            padding-left: 1rem;
            color: white;
            height: 10rem;
            overflow: hidden;

        }

        .more {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6;
        }

        .expanded {
            height: auto;
        }
    }

    .div_doctor_ProficientTreatment {
        text-align: left;
        padding-left: 1rem;
        color: white;
        overflow: hidden;
        margin-bottom: 0.5rem;
        border-radius: 1rem;
        width: 90%;
        margin: auto;
    }

    .more_ProficientTreatment {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    .expanded_ProficientTreatment {
        height: auto;
        text-align: left;
    }
}

.div_doctor_info_headPicture {
    height: 10rem;
    width: 13rem;
    padding-left: 1rem;

    img {
        height: 100%;
        width: 100%;
        border-radius: 1rem;
    }
}

.div_doctor_follow_main {
    background-color: aliceblue;
    height: 2rem;
    width: 4rem;
    line-height: 2rem;
    margin-right: 1rem;
    border-radius: 2rem;
}

.div_doctor_data {
    width: 94%;
    margin: auto;
    height: 4.5rem;
    background-color: #914F50;
    display: flex;
    border-radius: 1rem;
    margin-top: 0.5rem;
    color: white;
    .div_doctor_receive_number,
    .div_doctor_favorable_rate,
    .div_doctor_attention {
        width: 33%;
        justify-content: center;
    }

    .div_doctor_receive_number,
    .div_doctor_favorable_rate,
    .div_doctor_attention {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

}

.div_doctor_data_border {
    width: 70%;
    border: 0.1rem solid white;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.9rem;
    line-height: 1.5rem;
}

.doctor-tabs>.el-tabs__content {
    padding: 1.5rem;
    color: #6b778c;
    font-size: 1.5rem;
    font-weight: 600;
}

:deep(.el-tabs__item.is-active) {
    color: #0c927a;
}

:deep(.el-tabs__active-bar) {
    background-color: #0c927a;
}

.div_doctor_main_overview_content {
    width: 90%;
    margin: auto;
    overflow: hidden;
    text-align: left;
}

.more_overview_content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.div_doctor_main_honor {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 1rem;
}

.div_doctor_main_honor_img {
    width: 9rem;
    height: 11rem;
    margin: auto;
    margin-top: 1rem;

    img {
        height: 100%;
        width: 100%;
        margin-top: 0.5rem;
        object-fit: revert;
    }
}

.div_medicine_knowledge_head {
    display: flex;
    height: 2.5rem;
    line-height: 2.5rem;
    background-color: #ffffff;
    width: 85%;
    margin: auto;
    border-radius: 1rem;
    margin-top: 0.5rem;
    position: relative;

    .div_medicine_knowledge_head_title {
        width: 50%;
        text-align: left;
        padding-left: 0.5rem;
    }

    .div_medicine_knowledge_head_more {
        width: 50%;
        text-align: right;
        padding-right: 0.5rem;
    }
}

.div_medicine_knowledge_body {
    display: flex;
    height: 7rem;
    width: 90%;
    margin: auto;
}

.div_medicine_knowledge_image {
    width: 40%;
}

.div_medicine_knowledge_content {
    width: 60%;
    text-align: left;
}

.evaluate_title {
    display: flex;
    width: 90%;
    margin: auto;
    border-bottom: #0c927a 1px solid;
    height: 2rem;
    line-height: 2rem;
}

.evaluate_main {
    margin-top: 0.5rem;
}

.evaluate_mains {
    width: 82%;
    margin: auto;
    border-radius: 1.5rem;
    background-color: #f9f9f9;
    display: flex;
    margin-top: 1rem;
    padding: 1rem;
    flex-direction: column;
    box-shadow: 0 0.25rem 0.5rem 0 rgba(0,0,0,0.2);
    transition: 0.3s;
}

.evaluate_mains_time {
    text-align: right;
    margin-top: 0.5rem;
    padding-right: 1rem;
    color: #888;
    font-size: 0.8em;
}

.evaluate_mains_title {
    display: flex;
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 1rem;
}

.evaluate_headUrl {
    height: 100%;
    width: 15%;
    img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
    }
}

.evaluate_name {
    margin-left: 1rem;
}

.evaluate_rate {
    margin-left: 1rem;
}

.evaluate_mains_content {
    margin-top: 0.5rem;
    text-align: left;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999;
}

.modal img {
    max-width: 90%;
    max-height: 90%;
}
:deep(.el-tabs__nav-scroll .is-active){
    color: #752423;
}
:deep(.el-tabs__nav-scroll .el-tabs__active-bar){
    background-color: #752423;
}
</style>