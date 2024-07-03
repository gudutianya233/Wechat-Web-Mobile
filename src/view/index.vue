<!-- 首页页面 -->
<script  lang="ts" setup>
//import { useRouter } from 'vue-router';
// const router = useRouter();
import { useRouter } from 'vue-router';
import {  getLatestAnnouncement,
    getHospitalHonor,getDoctorSimpleInformation, getReleaseSwiperImage, getCommondAbility } from '../request/index';
import { Announcement } from '../entities/announcement.entities';

import { onMounted } from 'vue';
import { SwiperImage } from '../entities/swiperImage.entities';
import { Doctor } from '../entities/doctor/doctor.entities';
import { HospitalHonor } from '../entities/hospital_honor.entities';
import { CommondAbility } from '../entities/commond_ability.entities';
import { ElMessage } from 'element-plus';
import { Splide, SplideSlide } from "@splidejs/vue-splide";
//轮播图
const swiperImages: Ref<SwiperImage[] | null> = ref(null);
//公告
const announcement = ref<Announcement>({
    id: 0,
    title: '',
    content: '',
    create_time: '',
    founder: '',
    status: 0,
});
//医生列表
const DoctorList:Ref<Doctor[]|null>=ref(null)
const HospitalHonorList:Ref<HospitalHonor[]|null>=ref(null)
const CommondAbilityList:Ref<CommondAbility[]|null>=ref(null)
let isRequested = false //用一个变量来保证只发起一次请求，防止因为dom变化而导致重复请求
onMounted(async () => {
            if (!isRequested) {
            // 发送请求
          isRequested = true
    //获取轮播图的图片
    const res: SwiperImage[] = await getReleaseSwiperImage();
    swiperImages.value = res
    //最新的一条公告
    const latestAnnouncement = await getLatestAnnouncement();
    Object.assign(announcement.value, latestAnnouncement);
    //console.log('announcement_content',announcement)
    
    //首页的常用功能
    const CommondAbility=await getCommondAbility();
     CommondAbilityList.value=CommondAbility
                
    //获取名医坐诊列表

    const ress:Doctor[]=await getDoctorSimpleInformation();
    if(ress){
        DoctorList.value=ress
    }
  //  console.log(DoctorList.value)

  //获取医馆荣誉图片
    const resss:HospitalHonor[]=await getHospitalHonor();
    if(resss){
        HospitalHonorList.value=resss
    }
   // console.log(HospitalHonorList.value)
}
})

//查看更多公告
function announcement_more() {
    window.open('/announcement_home');
}

const convenientServices_main_register = 'http://localhost:3000/public/home/2023-8-15/div_convenientServices_main_register.png';    //线上挂号
const convenientServices_main_onlineAsk = 'http://localhost:3000/public/home/2023-8-15/div_convenientServices_main_onlineAsk.png';  //在线咨询
const convenientServices_main_phoneAsk = 'http://localhost:3000/public/home/2023-8-15/div_convenientServices_main_phoneAsk.png';    //电话咨询
const convenientServices_main_prescriptionDrug = 'http://localhost:3000/public/home/2023-8-15/div_convenientServices_main_prescriptionDrug.png';    //处方拿药

//线上挂号跳转
const router = useRouter();
function footer_two_off() {
    router.push('/famous_doctor_hall');
}

//电话咨询
const phoneNumber=ref('028-62100012')
function phoneAsk(){
    window.location.href = 'tel://' + phoneNumber.value;
}
function doctor_detail(id: number) {
    router.push({ name: 'doctor_detail', query: { id } });
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
function consultation(){
    window.location.replace('/swt/index.html');
}
function CommondAbilit(){
    ElMessage('功能正在建设中')
}

</script>

<template>
    <div class="div_top">
        <div class="div_top_round"></div>
        <div class="div_top_rotation">   
            <div>
                <!-- 因为数据是异步请求得到的,延迟Splide组件的渲染。v-if="swiperImages&&swiperImages.length > 0" -->
        <Splide  v-if="swiperImages&&swiperImages.length > 0" class="splide1" type="slide"
            :options="{autoplay: true, interval: 2000, rewind: true, pagination: true, arrows: false, type: 'slide' }">
            <SplideSlide v-for="item in swiperImages" :key="item.id">
                <img :src="item.url" style="height: 100%; width: 100%;"/>
            </SplideSlide>
        </Splide>
        </div>
    </div>
    </div>
    <div class="div_announcement">
        <div class="div_announcement_title">
            <span>公告</span>
        </div>
        <div class="div_announcement_content">
            <span>{{ announcement.title }}</span>
        </div>
        <div class="div_announcement_more" @click="announcement_more">
            <span>更多</span>
        </div>

    </div>
    <div class="div_convenientServices">
        <div class="div_convenientServices_title">
            <span>便民服务</span>
        </div>
        <div class="div_convenientServices_main">
            <div class="div_convenientServices_main_register">
                <img :src=convenientServices_main_register @click="footer_two_off()" />
            </div>
            <div class="div_convenientServices_main_onlineAsk">
                <img :src="convenientServices_main_onlineAsk" @click="consultation()"/>
            </div>
            <div class="div_convenientServices_main_phoneAsk">
                <img :src=convenientServices_main_phoneAsk style="margin-bottom: 10%;" @click="phoneAsk" />
                <img :src=convenientServices_main_prescriptionDrug @click="CommondAbilit"/>
            </div>

        </div>
    </div>
    <div class="div_commondAbility">
        <div class="div_commondAbility_title">
            <span>常用功能</span>
        </div>
        <div class="div_commondAbility_main">
            <div v-for="item in CommondAbilityList" :key="item.id" class="div_commondAbility_main_list" @click="CommondAbilit">
                <img :src=item.url />
                <span>{{ item.name }}</span>
            </div>
        </div>
    </div>
    <div class="div_doctor_list">
        <div class="div_doctor_list_title">
            <span>名医坐诊</span>
        </div>
        <div class="div_doctor_list_main">
            <div class="div_doctor" v-for="item  in DoctorList" :key="item.id" @click="doctor_detail(item.id)">
                <div class="div_doctor_picture">
                    <img :src=item.head__picture />
                </div>
                <div class="div_doctor_information">
                    <span>{{ item.name }}</span>
                    <span>{{ item.title }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="div_hospital_honor">
        <div class="div_hospital_honor_title">
            <span>医馆荣誉</span>
        </div>
        <div class="div_hospital_honor_main">
            <div v-for="item in HospitalHonorList" :key="item.id" @click="showImage(item.url)"
                class="div_hospital_honor_main_picture">
                <div><img v-if="item.url" :src="item.url" /></div>
                <div><span style="font-size: 1rem;">{{ item.name }}</span></div>
           
             
            </div>
        </div>

        <div v-if="showModal" class="modal">
            <img :src="modalImageUrl" alt="大图" @click="closeImage" />
        </div>
    </div>
</template>

<style scoped lang="less">
.div_top {
    position: relative;
    overflow: hidden;
    height: 12.5rem;
    width: 100%;
}

.div_top_search {
    z-index: 998;
    position: relative;
    top: 2rem;
}

.swiper-slide img {
    height: 100%;
    width: 100%;
    //  object-fit: contain;
}

.div_top_round {
    position: absolute;
    top: -8rem;
    width: 100%;
    height: 18rem;
    border-radius: 50%;
    background-color: #752423;
}

.div_top_rotation {
    width: 85%;
    margin: auto;
    margin-top: 2rem;
}

.div_announcement {
    background-color: #fafafa;
    width: 85%;
    height: 3.5rem;
    line-height: 3.5rem;
    margin: auto;
    border-radius: 1rem;
    display: flex;
    margin-top: 1rem;
    font-size: 1.4rem;

    .div_announcement_title {
        width: 15%;
        padding-left: 0.5rem;

        span {
            color: #ff8700;
            font-size: 1.4rem;
        }
    }

    .div_announcement_content {
        width: 70%;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;

        span {
            display: inline-block;
            padding-left: 100%;
            animation: div_top_announcement_content 7s linear infinite;
        }
    }

    @keyframes div_top_announcement_content {
        0% {
            transform: translate(0, 0);
        }

        100% {
            transform: translate(-100%, 0);
        }
    }

    .div_announcement_more {
        width: 15%;
        padding-right: 0.5rem;
    }
}

.div_convenientServices {
    background-color: #ffffff;
    width: 85%;
    height: 10rem;
    margin: auto;
    border-radius: 1rem;
    display: flex;
    margin-top: 1rem;
    font-size: 1.4rem;
    flex-direction: column;

    .div_convenientServices_title {
        width: 100%;
        text-align: left;
        padding-left: 0.5rem;
        padding-top: 0.5rem;
    }

    .div_convenientServices_main {
        width: 100%;
        display: flex;
        height: 6.5rem;

        .div_convenientServices_main_register {
            width: 30%;
            margin: 0.5rem;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .div_convenientServices_main_onlineAsk {
            width: 30%;
            margin: 0.5rem;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .div_convenientServices_main_phoneAsk {
            width: 30%;
            margin: 0.5rem;
            display: flex;
            flex-direction: column;

            img {
                width: 100%;
                height: 44%;
                object-fit: cover;
            }
        }
    }
}

.div_commondAbility {
    background-color: #ffffff;
    width: 85%;
    height: 9rem;
    margin: auto;
    border-radius: 1rem;
    display: flex;
    margin-top: 1rem;
    font-size: 1.4rem;
    flex-direction: column;

    .div_commondAbility_title {
        width: 100%;
        height: 2.5rem;
        text-align: left;
        padding-left: 0.5rem;
        padding-top: 0.5rem;
    }

    .div_commondAbility_main {
        height: 6rem;
        width: 100%;
        display: flex;

        .div_commondAbility_main_list {
            width: 25%;
            height: 5rem;
            font-size: .8rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                width: 55%;
            }
            span{
                font-size: 1.2rem;
            }
        }
    }

}

.div_doctor_list {
    background-color: #ffffff;
    width: 85%;
    margin: auto;
    border-radius: 1rem;
    display: flex;
    margin-top: 1rem;
    font-size: 1.4rem;
    flex-direction: column;
    margin-bottom: 1rem;

    .div_doctor_list_title {
        width: 100%;
        height: 2.5rem;
        text-align: left;
        padding-left: 0.5rem;
        padding-top: 0.5rem;
    }

    .div_doctor_list_main {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding-bottom: 1rem;

        .div_doctor {
            background-image: url("http://localhost:3000/public/home/2023-8-15/doctor_frame.png");
            background-size: contain;
            width: 9rem;
            height: 11rem;
            margin: auto;
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            background-color: white;

            .div_doctor_picture {
                height: 80%;

                img {
                    height: 95%;
                    width: 85%;
                    margin-top: 0.5rem;
                    object-fit: contain;
                    // background-color: #e3e3e3;
                }
            }

            .div_doctor_information {
                height: 20%;
                display: flex;
                flex-direction: column;

                span:first-child {
                    font-size: 0.8rem;
                    font-weight: bold;
                }

                span:last-child {
                    font-size: 0.6rem;
                }
            }
        }
    }
}

.div_hospital_honor {
    background-color: #ffffff;
    width: 85%;
    margin: auto;
    border-radius: 1rem;
    display: flex;
    margin-top: 1rem;
    font-size: 1.4rem;
    flex-direction: column;
    margin-bottom: 1rem;

    .div_hospital_honor_title {
        width: 100%;
        height: 2.5rem;
        text-align: left;
        padding-left: 0.5rem;
        padding-top: 0.5rem;
    }

    .div_hospital_honor_main {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding-bottom: 1rem;

        .div_hospital_honor_main_picture {
            width: 40%;

    margin: auto;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    background-color: #ECECEC;
    padding: 0.5rem;
    border-radius: 1rem;
            img {
                height: 100%;
                width: 100%;
                margin-top: 0.5rem;
                object-fit: revert;
            }
        }

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
    }

    .modal img {
        max-width: 90%;
        max-height: 90%;
    }
}
</style>