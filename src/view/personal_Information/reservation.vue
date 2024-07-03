<!-- 订单管理 -->
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { UserRegister } from '../../entities/user/user_register';
import { getUserRegister, reservationPlaceOrder, userWeChatCancel, userWeChatRefund } from '../../request/patient_card_management';
import { wxPay } from '../../util/weChat_pay';
import { getPaySign, getSignature } from '../../request/WeChat';

const route = useRoute();
const activeName = ref('first')//默认tab切换为待就诊
const userId = ref(0)//用户id
const UserRegisters: Ref<UserRegister[] | null> = ref(null)
//切换用户的不同状态订单，待就诊，已就诊，待支付，已取消，退款

const firstList: Ref<UserRegister[]> = ref([])//待就诊
const secondList: Ref<UserRegister[]> = ref([])//已就诊
const thirdList: Ref<UserRegister[]> = ref([])//待支付
const fourthList: Ref<UserRegister[]> = ref([])//已取消(支付失败)
const refundList: Ref<UserRegister[]> = ref([])//退款
    async function init() {
        //每次进行操作后，重新请求时，先把原来的数据清空掉，重新赋值
        firstList.value=[]
        secondList.value=[]
        thirdList.value=[]
        fourthList.value=[]
        refundList.value=[]
    // 获得url里的userId和activeName
    userId.value =Number(route.query.userId)
    activeName.value =route.query.activeName  as string
    //获得当前用户的所有挂号情况
    const res: UserRegister[] = await getUserRegister(userId.value)
    if (res) {
        UserRegisters.value = res
        UserRegisters.value.forEach(order => {
            switch (order.order_status) {
                case 0://待支付
                        thirdList.value.push(order);
                    break;
                case 1://已支付
                        firstList.value.push(order);
                    break;
                case 2://已取消(支付失败)
                        fourthList.value.push(order);
                    break;
                case 3://已就诊(签到完成)
                        secondList.value.push(order);
                    break;
                case 4://发起退款
                case 5://退款失败
                case 6://退款完成
                        refundList.value.push(order);
                    break;
            }
        })
        
    }
}

//待支付的订单点击支付
async function pay(id: number) {
    //遍历得到匹配的id数据
    const userRegister = thirdList.value.find(item => item.id === id);
    //console.log(userRegister)
    if (userRegister) {
        const res: any = await reservationPlaceOrder(userRegister)
        // console.log(res.data)
        if (res.status == 200) {
            const appId = import.meta.env.VITE_APP_ID
            //时间戳(毫秒数)
            const timestamps = new Date().getTime()
            // 将毫秒数转换为秒
            const timestamp = Math.floor(timestamps / 1000);
            // 生成32位的随机字符串
            const nonceStr = generateRandomString(32);
            //获得url地址所有内容
            //  const fullUrl = window.location.href;
            const fullUrl = location.href.split('#')[0];
            // 待签名参数
            const params = {
                noncestr: nonceStr,
                timestamp: timestamp,
                url: fullUrl // 网页URL
            };
            console.log(params)
            //后端加密得到签名(配置wx.config)
            const signature = await getSignature(params)
            //提取prepay_id参数值
            const resData = JSON.parse(res.data);
            const prepay_id = resData.prepay_id;
            const packages = 'prepay_id=' + prepay_id;
            //后端加密得到签名(配置wx.chooseWXPay)
            const paramss = {
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                package: packages
            }
            console.log(paramss)
            //后端加密得到签名(配置wx.chooseWXPay)
            const paySign = await getPaySign(paramss)
            const param = { appId, timestamp, nonceStr, packages, signature, paySign }
          const ress:any= await wxPay(param)
          if(ress.code==200){
            activeName.value='first'
          }
        }
        else {
            ElMessage({ message: `${res.data}`, type: 'error', duration: 1000});
            activeName.value='third' 
        }
    }
    await init()
}
//未就诊的订单发起退款/退款失败的订单发起退款
async function refund(id: number) {
    //遍历得到匹配的id数据
    const userRegister = firstList.value.find(item => item.id === id);
    console.log(userRegister)
    ElMessage({ message: `订单申请退款成功，请等待审核进行退款`, });
    if (userRegister) {
        const res: any = await userWeChatRefund(userRegister)
        if (res.code == 200) {
            //退款成功
            await ElMessage({ message: `${res.message}`, type: 'success' , duration: 1000});
            activeName.value='refund'
        }
        else {
            await ElMessage({ message: `${res.message}`, type: 'error', duration: 1000 });
        }
    }
    await init()
}
//待支付的订单，点击取消
async function cancel(id: number) {
    //遍历得到匹配的id数据
    const userRegister = thirdList.value.find(item => item.id === id);
    console.log(userRegister)
    ElMessage({ message: `订单申请取消提交成功`, duration: 1000});
    if (userRegister) {
        const res: any = await userWeChatCancel(userRegister)
        if (res.code == 200) {
            await ElMessage({ message: `${res.message}`, type: 'success' , duration: 1000 });
        }
        else {
            await ElMessage({ message: `${res.message}`, type: 'error' , duration: 1000});
        }
    }
    activeName.value='fourth'
    await init()
}
onMounted(() => {
    init()
})
function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
</script>
<template>
    <div>
        <el-tabs v-model="activeName" class="order-tabs" :stretch="true">
            <el-tab-pane label="待就诊" name="first">
                <div class="div_first" :key="item.id" v-for="item in firstList">
                    <div class="div_first_tag">
                        <div class="div_refund">
                            <el-tag style="font-size: 1.2rem;">
                                待就诊
                            </el-tag>
                        </div>
                    </div>
                    <div class="div_first_name"><span>预约专家：</span><span>{{ item.doctor.name }}</span></div>
                    <div class="div_first_pay"><span>挂号费用：</span><span>{{ item.pay_money }}</span></div>
                    <div class="div_first_create_time"><span>挂号时间：</span><span>{{ item.create_time }}</span></div>
                    <div class="div_first_work_time"><span>就诊时间：</span><span>{{ item.work_time }}</span>&nbsp;<span
                            v-if="item.status == 2">上午</span><span v-else>下午</span></div>
                    <div class="div_first_name"><span>订单号码：</span><span>{{ item.SystemNumber }}</span></div>
                    <div class="div_patient_name"><span>就诊人：</span><span>{{ item.patient_name }}</span></div>
                    <div class="div_operate">
                        <div class="div_refunds">
                            <el-button type="primary" round @click="refund(item.id)">退款</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已就诊" name="second">
                <div v-for="item in secondList">
                    <div class="div_second" :key="item.id">
                        <div class="div_second_tag">
                            <el-tag type="success" style="font-size: 1.2rem;">
                                已就诊
                            </el-tag>
                        </div>
                        <div class="div_second_name"><span>预约专家：</span><span>{{ item.doctor.name }}</span></div>
                        <div class="div_second_pay"><span>挂号费用：</span><span>{{ item.pay_money }}</span></div>
                        <div class="div_second_create_time"><span>挂号时间：</span><span>{{ item.create_time }}</span></div>
                        <div class="div_second_work_time"><span>就诊时间：</span><span>{{ item.work_time }}</span>&nbsp;<span
                                v-if="item.status == 2">上午</span><span v-else>下午</span></div>
                        <div class="div_first_name"><span>订单号码：</span><span>{{ item.SystemNumber }}</span></div>
                        <div class="div_second_name"><span>就诊人：</span><span>{{ item.patient_name }}</span></div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="待支付" name="third">
                <div v-for="item in thirdList">
                    <div class="div_first" :key="item.id">
                        <div class="div_third_tag">
                            <el-tag type="warning" style="font-size: 1.2rem;">
                                待支付
                            </el-tag>
                        </div>
                        <div class="div_first_name"><span>预约专家：</span><span>{{ item.doctor.name }}</span></div>
                        <div class="div_first_pay"><span>挂号费用：</span><span>{{ item.pay_money }}</span></div>
                        <div class="div_first_create_time"><span>挂号时间：</span><span>{{ item.create_time }}</span></div>
                        <div class="div_first_work_time"><span>就诊时间：</span><span>{{ item.work_time }}</span>&nbsp;<span
                                v-if="item.status == 2">上午</span><span v-else>下午</span></div>
                        <div class="div_first_name"><span>订单号码：</span><span>{{ item.SystemNumber }}</span></div>
                        <div class="div_first_name"><span>就诊人员：</span><span>{{ item.patient_name }}</span></div>
                        <div class="div_operate">
                            <div class="div_report">
                                <el-button type="primary" round @click="pay(item.id)">支付</el-button>
                            </div>
                            <div class="div_refund">
                                <el-button type="primary" round @click="cancel(item.id)">取消</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已取消" name="fourth">
                <div v-for="item in fourthList">
                    <div class="div_first" :key="item.id">
                        <div class="div_fourth_tag">
                            <el-tag type="info" style="font-size: 1.2rem;">
                                已取消
                            </el-tag>
                        </div>
                        <div class="div_first_name"><span>预约专家：</span><span>{{ item.doctor.name }}</span></div>
                        <div class="div_first_pay"><span>挂号费用：</span><span>{{ item.pay_money }}</span></div>
                        <div class="div_first_create_time"><span>挂号时间：</span><span>{{ item.create_time }}</span></div>
                        <div class="div_first_work_time"><span>就诊时间：</span><span>{{ item.work_time }}</span>&nbsp;<span
                                v-if="item.status == 2">上午</span><span v-else>下午</span></div>
                        <div class="div_first_name"><span>订单号码：</span><span>{{ item.SystemNumber }}</span></div>
                        <div class="div_first_name"><span>就诊人员：</span><span>{{ item.patient_name }}</span></div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="退款" name="refund">
                <div v-for="item in refundList">
                    <div class="div_first" :key="item.id">
                        <div class="div_refund_tag">
                            <el-tag type="danger" style="font-size: 1.2rem;">
                                退款
                            </el-tag>
                        </div>
                        <div class="div_first_name"><span>预约专家：</span><span>{{ item.doctor.name }}</span></div>
                        <div class="div_first_pay"><span>挂号费用：</span><span>{{ item.pay_money }}</span></div>
                        <div class="div_first_create_time"><span>挂号时间：</span><span>{{ item.create_time }}</span></div>
                        <div class="div_first_work_time"><span>就诊时间：</span><span>{{ item.work_time }}</span>&nbsp;<span
                                v-if="item.status == 2">上午</span><span v-else>下午</span></div>
                        <div class="div_first_name"><span>订单号码：</span><span>{{ item.SystemNumber }}</span></div>
                        <div class="div_first_name"><span>就诊人员：</span><span>{{ item.patient_name }}</span></div>
                        <div class="div_refunds_tag">
                            <el-tag v-if="item.order_status == 4" style="font-size: 1.2rem;">
                                退款审核中
                            </el-tag>
                            <el-tag  v-if="item.order_status == 5" @click="refund(item.id)"  type="danger" style="font-size: 1.2rem;">
                                重新申请退款
                            </el-tag>
                            <el-tag v-if="item.order_status == 6" type="success" style="font-size: 1.2rem;">
                                退款成功
                            </el-tag>
                        </div>

                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="less" scoped>
:deep(.el-tabs__item) {
    padding: 0;
}

:deep(.el-tabs__header) {
    margin: 0;
}

.div_first {
    width: 85%;
    margin: auto;
    margin-top: 1rem;
    background-color: white;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
}

.div_first_name,
.div_first_pay,
.div_first_create_time,
.div_first_work_time,
.div_patient_name {
    padding-left: 1rem;
    text-align: left;
    font-size: 1.2rem;
    line-height: 2rem;
    height: 2rem;
}

.div_first_tag,
.div_second_tag,
.div_third_tag,
.div_fourth_tag,
.div_refund_tag {
    text-align: left;
    padding-left: 1rem;
    line-height: 2rem;
    height: 2.5rem;
}

.div_refunds_tag {
    text-align: center;
    padding-left: 1rem;
    line-height: 2rem;
    height: 2.5rem;
}

.div_first_tag {
    border-bottom: 1px solid #409eff;
}

.div_second_tag {
    border-bottom: 1px solid #82cd5d;
}

.div_third_tag {
    border-bottom: 1px solid #e9ae55;
}

.div_fourth_tag {
    border-bottom: 1px solid #adafb4;
}

.div_refund_tag {
    border-bottom: 1px solid #f9a0a0;
}

.div_operate {
    display: flex;
    margin-top: 0.7rem;
}

.div_refunds {
    width: 100%;
}

.div_report,
.div_refund {
    width: 50%;
}

.div_second {
    width: 85%;
    margin: auto;
    margin-top: 1rem;
    background-color: white;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
}

.div_second_name,
.div_second_pay,
.div_second_create_time,
.div_second_work_time,
.div_second_name {
    padding-left: 1rem;
    text-align: left;
    font-size: 1.2rem;
    line-height: 2rem;
    height: 2rem;
}
</style>