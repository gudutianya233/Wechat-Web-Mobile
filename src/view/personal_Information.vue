<!-- 用户详情页面 -->
<script  lang="ts" setup>
import { CommonFunction } from '../entities/user/common_function.entities';
import { getUserInformation, getCommonFunction } from '../request/user'
import { useRouter } from 'vue-router';
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import { getUserAuthorize } from '../request/WeChat';
const router = useRouter();
const openid = window.localStorage.getItem('openid');
//用户信息
const  user_information = ref({
    id: 0,
    openid: '',
    nickname: '',
    city: '',
    province: '',
    country: '',
    headimgurl: '',
    authorize_time: '',
})
//用户功能
const information_function_lists: Ref<CommonFunction[] | null> = ref(null);
let isRequested = false //用一个变量来保证只发起一次请求，防止因为dom变化而导致重复请求
onMounted(async () => {
    if (openid) {
        if (!isRequested) {
            // 发送请求
            isRequested = true
            const ress: CommonFunction[] = await getCommonFunction();
            const res = await getUserInformation(openid);
            console.log(res)
            if (res) {
                user_information.value = res
                //    console.log(user_information)
            }
            if(ress){
                //console.log(ress)
                information_function_lists.value=ress
            }
        }

    }
});
//功能跳转
async function information_main_function(type: string) {
    const userId=user_information.value.id
    const activeName= ref('first')
    if(type=='reservation'){
        //我的预约
        router.push({ name: type, query: { userId, activeName: activeName.value } });
    }
    else if(type=='patient_card_management'||type=='my_attention'){
        //就诊卡管理和我的关注
        router.push({ name: type, query: { userId } });
    }
    else if(type=='clear'){
        localStorage.clear()
        ElMessage({ message: `清除缓存成功`, type: 'success', });
        await getUserAuthorize().then((res: any) => {
                            const url = res.url;
                            window.location.href = url;
                        });
    }
    else if(type=='seek_advice_online'){
        //在线咨询
        window.location.replace('/swt/index.html');
    }
    else if(type=='waiting_evaluation'){
        //评价管理
        router.push({ name: type });
    }
    else{
        ElMessage('功能正在建设中')
    }
}
</script>

<template>
    <div class="div_personal_information_title">
        <div class="div_personal_information_title_information">
            <div class="div_personal_information_title_information_headPicture">
                <img :src="user_information.headimgurl" />
            </div>
            <div class="div_personal_information_title_information_name">{{ user_information.nickname }}</div>
        </div>
    </div>
    <div class="div_personal_information_main">
        <div v-for="item in information_function_lists" :key="item.id" @click="information_main_function(item.type)"
            class="div_personal_information_main_function">
            <div>
                <img :src="item.iconUrl" />
            </div>
            <div>
                <span>{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.div_personal_information_title {
    background-color:#752423;
    height: 6rem;
    text-align: left;

    .div_personal_information_title_information {
        display: flex;
        padding-left: 1.5rem;
        padding-top: 1.5rem;

        .div_personal_information_title_information_headPicture {
            height: 3rem;
            width: 3rem;

            img {
                height: 100%;
                width: 100%;
                border-radius: 0.9rem;
                object-fit: contain;
            }
        }

        .div_personal_information_title_information_name {
            margin-left: 0.5rem;
            color: azure;
            line-height: 3rem;
        }

    }
}

.div_personal_information_main {
    width: 85%;
    background-color: #ffffff;
    border-radius: 1rem;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    top: 5.2rem;
    left: 2rem;
    padding-top: 0.5rem;
    padding-bottom: 1rem;

    .div_personal_information_main_function {
        width: 5rem;
        height: 5rem;
        margin-left: 0.5rem;
        margin-top: 0.5rem;
        font-size: 1rem;

        img {
            width: 5rem;
            height: 3rem;
            object-fit: contain;

            object-fit: contain;
        }
    }
}
</style>
