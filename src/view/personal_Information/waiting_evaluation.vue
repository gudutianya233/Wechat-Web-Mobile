<!-- 评价管理 -->
<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { UserEvaluate } from '../../entities/user/user_evaluate.entities';
import { UserRegister } from '../../entities/user/user_register';
import { changeEvaluate, getEvaluate, saveUserEvaluateRegister, seeUserEvaluate } from '../../request/waiting_evaluation';
import { CloseBold } from '@element-plus/icons-vue'

const activeName = ref('first')//默认tab切换为待评价
const openid = localStorage.getItem("openid");
const wait_evaluate: Ref<UserRegister[]> = ref([]) //待评价的订单
const evaluated: Ref<UserRegister[]> = ref([]) //已评价的订单
const evaluateShow = ref(false)//添加评价的弹出框
const evaluateSeeShow = ref(false)//查看评价的弹出框

const init = async () => {
    const loading = ElLoading.service({ fullscreen: true });
    try {
        if (openid) {
            //获得所有已就诊的订单
            const res = await getEvaluate(openid)
            if (res.wait_evaluate != null) {
                wait_evaluate.value = res.wait_evaluate
                evaluated.value = res.evaluated
                console.log(wait_evaluate.value)
                console.log(evaluated.value)
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.close();
    }
}
const getDay = (status: number) => {
    if (status == 2)
        return '上午'
    else
        return '下午'

}
//用户对订单进行评价的数据(Partial包裹，所有属性全部为可选)
let userEvaluate: Partial<UserEvaluate> = {
};
//评价等级
const stars = ref(0)
//评价内容
const content = ref('')
//选中的订单数据
const user_register: Ref<UserRegister | undefined> = ref()
//评价关联的外键是医生id
//点击订单评价按钮
const evaluate = (id: number) => {
    evaluateShow.value = true
    //先拿到需要评价的订单
    user_register.value = wait_evaluate.value.find(item => item.id === id)
    console.log(user_register.value)
}
const reset = () => {
    stars.value = 0
    content.value = ''
}
//关闭评价框
const closeSaveEvaluate = () => {
    evaluateShow.value = false

    reset()
}
//添加评价
const saveEvaluate = async () => {
    userEvaluate.content = content.value
    userEvaluate.stars = stars.value
    userEvaluate.doctor_name = user_register.value?.doctor.name
    userEvaluate.evaluate_name = user_register.value?.patient_name
    userEvaluate.doctorId = user_register.value?.doctor.id
    userEvaluate.status = true
    userEvaluate.SystemNumber = user_register.value?.SystemNumber
    console.log(userEvaluate)
    const res = await saveUserEvaluateRegister(userEvaluate)
    if (res.code == 200) {
        ElMessage({
            message: `订单评价成功`,
            type: 'success',
        })
    }
    else {
        ElMessage({
            message: `订单评价失败`,
            type: 'error',
        })
    }
    evaluateShow.value = false
    reset()
    init()
}
//查看评价的好评率和评价内容
const userEvaluate_content=ref('')
const userEvaluate_stars=ref(0)
//查看评价按钮
const evaluateSee=async (id:number)=>{
    user_register.value = evaluated.value.find(item => item.id === id)
    if(user_register.value){
        const res=await seeUserEvaluate(user_register.value.SystemNumber)
        if(res.code==200){
            evaluateSeeShow.value=true
            userEvaluate_content.value=res.data.content
            userEvaluate_stars.value=res.data.stars  
            userEvaluate=res.data
        }
       else{
        ElMessage({
            message: `${res.message}`,
            type: 'error',
        })
       }
    }

}
//修改评价
const seeEvaluate=async()=>{
    userEvaluate.stars=userEvaluate_stars.value
    userEvaluate.content=userEvaluate_content.value
     const res=await changeEvaluate(userEvaluate)
     if (res.code == 200) {
        ElMessage({
            message: `修改评价成功`,
            type: 'success',
        })
    }
    else {
        ElMessage({
            message: `修改评价失败`,
            type: 'error',
        })
    }
    closeSeeEvaluate()
    init()
}
const closeSeeEvaluate=()=>{
    evaluateSeeShow.value=false

}
onMounted(async () => {
    await init()
})

</script>

<template>
    <el-tabs v-model="activeName" class="order-tabs" :stretch="true">
        <el-tab-pane label="待评价" name="first">
            <div v-for="item in wait_evaluate" :key="item.id" class="wait">
                <div class="item">
                    <span>订单号：</span><span>{{ item.SystemNumber }}</span>
                </div>
                <div class="item">
                    <span>就诊人：</span><span>{{ item.patient_name }}</span>
                </div>
                <div class="item">
                    <span>就诊医生：</span><span>{{ item.doctor.name }}</span>
                </div>
                <div class="item">
                    <span>挂号费：</span><span>{{ item.pay_money }}&nbsp;元</span>
                </div>
                <div class="item">
                    <span>就诊时间：</span><span>{{ item.work_time }}:{{ getDay(item.status) }}</span>
                </div>
                <div style="text-align: center;margin-top: 0.8rem;">
                    <el-button type="primary" round @click="evaluate(item.id)">评价</el-button>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="已评价" name="second">
            <div v-for="item in evaluated" :key="item.id" class="evaluated">
                <div class="item">
                    <span>订单号：</span><span>{{ item.SystemNumber }}</span>
                </div>
                <div class="item">
                    <span>就诊人：</span><span>{{ item.patient_name }}</span>
                </div>
                <div class="item">
                    <span>就诊医生：</span><span>{{ item.doctor.name }}</span>
                </div>
                <div class="item">
                    <span>挂号费：</span><span>{{ item.pay_money }}&nbsp;元</span>
                </div>
                <div class="item">
                    <span>就诊时间：</span><span>{{ item.work_time }}:{{ getDay(item.status) }}</span>
                </div>
                <div style="text-align: center;margin-top: 0.8rem;">
                    <el-button type="success" round @click="evaluateSee(item.id)">查看</el-button>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
    <!-- 添加评价的弹出框 -->
    <div v-show="evaluateShow" class="saveEvaluate">
        <div class="saveEvaluate_close"> <el-button type="danger" :icon="CloseBold" circle @click="closeSaveEvaluate" />
        </div>
        <div class="item">
            <span>订单号：</span><span>{{ user_register?.SystemNumber }}</span>
        </div>
        <div class="item">
            <span>就诊医生</span>
            <span>{{ user_register?.doctor.name }}</span>
        </div>
        <div class="item">
            <span>就诊人</span>
            <span>{{ user_register?.patient_name }}</span>
        </div>
        <div class="item">
            <span>评价等级</span>
            <span><el-rate v-model="stars" clearable /></span>
        </div>
        <div>
            <div>评价内容</div>
            <div style="margin-top: 0.5rem;margin-bottom: 0.5rem;">
                <el-input v-model="content" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入评价内容" />
            </div>
        </div>
        <div style="text-align: center;margin-top: 0.8rem;">
            <el-button type="primary" round @click="saveEvaluate">提交</el-button>
        </div>
    </div>
        <!-- 查看评价的弹出框 -->
        <div v-show="evaluateSeeShow" class="saveEvaluate">
        <div class="saveEvaluate_close"> <el-button type="danger" :icon="CloseBold" circle @click="closeSeeEvaluate" />
        </div>
        <div class="item">
            <span>订单号：</span><span>{{ user_register?.SystemNumber }}</span>
        </div>
        <div class="item">
            <span>就诊医生</span>
            <span>{{ user_register?.doctor.name }}</span>
        </div>
        <div class="item">
            <span>就诊人</span>
            <span>{{ user_register?.patient_name }}</span>
        </div>
        <div class="item">
            <span>评价等级</span>
            <span><el-rate v-model="userEvaluate_stars" clearable /></span>
        </div>
        <div>
            <div>评价内容</div>
            <div style="margin-top: 0.5rem;margin-bottom: 0.5rem;">
                <el-input v-model="userEvaluate_content" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"  />
            </div>
        </div>
        <div style="text-align: center;margin-top: 0.8rem;">
            <el-button type="success" round @click="seeEvaluate">修改</el-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
.wait,
.evaluated,
.saveEvaluate {
    width: 80%;
    background-color: #FFFFFF;
    margin: auto;
    padding: 0.7rem;
    text-align: left;
    margin-bottom: 0.9rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    border: 1px solid black;

    .item {
        display: flex;
        justify-content: space-between;
    }
}

.saveEvaluate {
    font-size: 1rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // height: 36rem;
    display: flex;
    flex-direction: column;
}

.saveEvaluate_close {
    position: absolute;
    right: -0.8rem;
    top: -1.2rem;
    color: red;
}
</style>