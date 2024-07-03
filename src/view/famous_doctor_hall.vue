<!-- 名医堂页面 -->
<script  lang="ts" setup>
import { Doctor } from '../entities/doctor/doctor.entities';
import { getDoctorInformation } from '../request/famous_doctor_hall';
const router = useRouter();
//名医堂医生列表
const DoctorList: Ref<Doctor[] | null> = ref(null)
const  input=ref('')
let isRequested = false //用一个变量来保证只发起一次请求，防止因为dom变化而导致重复请求
onMounted(async () => {
    if (!isRequested) {
        // 发送请求
        isRequested = true
        const res: Doctor[] = await getDoctorInformation(input.value)
        if (res) {
            DoctorList.value = res            
        }
      
    }
})

async function search(){
    const res= await getDoctorInformation(input.value)
    if(res){
        DoctorList.value = res
    }
}
function doctor_detail(id: number) {
    router.push({ name: 'doctor_detail', query: { id } });
}
 const search_img='http://localhost:3000/public/icon/2023-8-15/search.png' 
</script>

<template>
    <div class="div_top_search">
        <div class="div_search">
        <div class="div_search_icon">
            <img :src=search_img alt="Image">
        </div>
        <div class="div_search_input">
            <el-input v-model="input"  placeholder="请输入需要查询的医生" />
        </div>
        <div class="div_search_button">
            <el-button type="primary" round   @click="search">搜索</el-button>
        </div> 
    </div>
    </div>
    <div v-for="item in DoctorList " :key="item.id" @click="doctor_detail(item.id)" class="div_doctor_list">
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
.div_top_search {
    z-index: 998;
    position: relative;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    .div_search {
    background-color: rgb(250, 250, 250);
    width: 85%;
    height: 3.5rem;
    margin: auto;
    border-radius: 1rem;
    display: flex;

    .div_search_icon {
        width: 10%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .div_search_input {
        width: 70%;
        line-height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .div_search_button {
        display: flex;
        align-items: center;
    }

}
.el-button{
    background-color:#a61212;
    font-size: 1.3rem;
    margin-right: 1rem;
}


:deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px;
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 0px;
}

:deep(.el-input__wrapper:focus) {
    box-shadow: 0 0 0 0px;
}
}

.div_doctor_list {
    width: 90%;
    height: 11rem;
    margin: auto;
    margin-bottom: 1rem;
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
