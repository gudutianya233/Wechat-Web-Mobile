<!-- 我的关注 -->
<script setup lang="ts">
import { Doctor } from '../../entities/doctor/doctor.entities';
import { getUserFollowInfo } from '../../request/my_attention';
const router = useRouter();
const route = useRoute();
//用户id
const id = ref(0)
const followDoctor: Ref<Doctor[] | null> = ref(null)
    async function init() {
            //从url地址取到用户id
            if (route.query.userId) {
            id.value = Number(route.query.userId);
            }
    const res: Doctor[] = await getUserFollowInfo(id.value)
        if (res) {
            followDoctor.value = res
        }
}
function doctor_detail(id: number) {
    router.push({ name: 'doctor_detail', query: { id } });
}
let isRequested = false //用一个变量来保证只发起一次请求，防止因为dom变化而导致重复请求
onMounted(async () => {
    if (!isRequested) {
        // 发送请求
        isRequested = true
       await init()
    }
})
</script>

<template>
      <div v-for="item in followDoctor " :key="item.id" @click="doctor_detail(item.id)" class="div_doctor_list">
        <div class="div_doctor_list_picture">
            <img :src="item.head__picture" />
        </div>
        <div class="div_doctor_list_information">
            <div class="div_doctor_list_title">
                <span>{{ item.name }}</span>&nbsp;&nbsp;
                <span>{{ item.title }}</span>
            </div>
            <div class="div_doctor_list_introduce">
                <span> 医生简介:{{ item.overview_content }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.div_doctor_list {
    width: 90%;
    height: 11rem;
    margin: auto;
    margin-top: 1rem;
    display: flex;
    background-color: #ffffff;
    border-radius: 2rem;

    .div_doctor_list_picture {
        width: 35%;

        img {
            height: 80%;
            width: 85%;
            margin-top: 1rem;
            object-fit: contain;
            background-color: #e3e3e3;
            border-radius: 1rem;
        }
    }

    .div_doctor_list_information {
        width: 65%;
        text-align: left;
        margin-top: 1rem;

        .div_doctor_list_title {
            span:first-child {
                font-size: 1.5rem;
                font-weight: bold;
                color: #a61212;
            }

            span:last-child {
                font-size: 1rem;
                color: #ba5f5e;
            }
        }

        .div_doctor_list_introduce {
            height: 6rem;
            padding-right: 1rem;
            margin-top: 0.5rem;
            position: relative;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            /* 指定最多显示的行数 */
            overflow: hidden;

            span:first-child {
                display: block;
                // height: 6rem;
                word-wrap: break-word;
            }


        }
    }

}
</style>