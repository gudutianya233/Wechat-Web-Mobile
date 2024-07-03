<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { Doctor } from '../entities/doctor/doctor.entities';
import { PatientsCard } from '../entities/user/patient_card.entities';
import { getRegisterDoctor } from '../request/doctor_detail';
import { getUserPatientsCardWeChat, userRegisterPlaceOrder } from '../request/patient_card_management';
import { Check } from '@element-plus/icons-vue'
import { UserRegister } from '../entities/user/user_register';
import { wxPay } from '../util/weChat_pay'
import { getSignature, getPaySign } from '../request/WeChat';
const router = useRouter();
const route = useRoute();

const select_patients = ref(true)//默认没有选有就诊卡数据
//就诊卡列表
const PatientsCardlist: Ref<PatientsCard[] | null> = ref(null)
const patient_card = ref(false)//选择就诊卡弹窗
const userId = ref(0)//用户id
const doctorId = ref(0)//医生id
const work_time = ref('')//挂号的时间
const status = ref(0)//2=上午，3=下午
const doctor: Ref<Doctor | null> = ref(null)
//选择就诊人按钮
function select_patient() {
    patient_card.value = true
}
//是否具有就诊卡
const isPatient = ref(true)
//添加就诊卡跳转
function add_patient() {
    const userIds = userId.value
    router.push({ name: 'add_patient_card', query: { userId: userIds } });
}
// 定义一个变量来记录当前选中的就诊卡的索引，初始值为-1
const selected = ref(-1)
// 定义一个方法来更新选中的就诊卡的索引
function selectCard(index: number) {
    //  console.log(index)
    selected.value = index;
}
const patient_name = ref('')//挂号的人名
const phone = ref('')//挂号的电话号码
const id_number = ref('')//挂号的身份证号码
const describe = ref('')//挂号的病情描述
//选中的就诊卡
const select_index = ref(0)
//选中就诊卡确定按钮
function select_patient_card() {
    select_index.value = selected.value
    console.log(select_index.value)
    if (select_index.value == -1) {
        ElMessage({
            message: `请选择就诊卡`,
            type: 'error',
        })
    }
    else {
        if (PatientsCardlist.value) {
            console.log(PatientsCardlist.value[select_index.value])
            patient_name.value = PatientsCardlist.value[select_index.value].name
            phone.value = PatientsCardlist.value[select_index.value].phone
            id_number.value = PatientsCardlist.value[select_index.value].id_number
            select_patients.value = false
            patient_card.value = false
        }
    }

}
let userRegister: UserRegister = {
    id: 0,
    doctor: {},
    patient: {},
    user: {},
    patient_name: '',
    phone: '',
    id_number: '',
    describe:'',
    work_time: '',
    status: 2,
    pay_money: 0,
    pay_time: '',
    WeChatNumber: '',
    SystemNumber: '',
    create_time: '',
    update_time: '',
    order_status: 0,
}
//提交订单
async function cost_submit() {
   // console.log(patient_name.value)
    if (patient_name.value == '') {
        ElMessage({
            message: `没有选择就诊人`,
            type: 'error',
        })
    }
    else {
        //提交订单,还没有输入密码支付,先请求获得微信支付的预付单
        userRegister.doctor.id = doctorId.value
        userRegister.user.id = userId.value
        if (PatientsCardlist.value) {
            userRegister.patient.id = PatientsCardlist.value[select_index.value].id
        }
        userRegister.patient_name = patient_name.value
        userRegister.phone = phone.value
        userRegister.id_number = id_number.value
        userRegister.work_time = work_time.value
        userRegister.status = status.value
        userRegister.describe = describe.value
        userRegister.order_status = 0
        if (doctor.value) {
            userRegister.pay_money = doctor.value.registration_cost
        }
        // console.log(userRegister)
        const res: any = await userRegisterPlaceOrder(userRegister)
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
                //   jsapi_ticket: ticket.Jsapi_ticket,
                noncestr: nonceStr,
                timestamp: timestamp,
                url: fullUrl // 网页URL
            };
            // console.log(params)
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
            await wxPay(param)
            await router.push({ name: 'personal_Information' });
        }
        else {
            ElMessage({ message: `${res.message}`, type: 'error', });
        }
    }
}


onMounted(async () => {
    // 获得url里的userId和doctorId
    doctorId.value = Number(route.query.doctorId)
    userId.value = Number(route.query.userId)
    work_time.value = route.query.work_time as string
    status.value = Number(route.query.status)
    //得到挂号的医生信息
    const res: Doctor = await getRegisterDoctor(doctorId.value)
    // console.log(res)
    doctor.value = res
    //获得当前用户的就诊卡信息
    const ress: any = await getUserPatientsCardWeChat(userId.value)
    if (ress[0]) {
        // console.log('有就诊卡')
        isPatient.value = false
        PatientsCardlist.value = ress

    }
    else {
        // console.log('没有就诊卡 ')   
        isPatient.value = true
    }
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
<template @click="patient_card=false">
    <div class="div_top_time">
        <div>{{ work_time }}&nbsp;&nbsp;<span v-if="status == 2">上午</span><span v-else>下午</span></div>
    </div>
    <div class="div_register">
        <div class="registre_doctor">
            <div class="registre_doctors">
                <div class="font_one">就诊医生：</div>
                <div class="font_one">{{ doctor?.name }}</div>&nbsp;&nbsp;
                <div class="font_two">{{ doctor?.title }}</div>
            </div>
            <div>
                <div class="original_registration">
                    <div class="horizontal_line"></div>
                    <div>原价：{{ doctor?.original_registration_cost }}</div>
                </div>
                <div class="font_two" style="font-size: 1.5rem;">挂号费用：{{ doctor?.registration_cost }}</div>
            </div>
        </div>
        <div style="width: 100%;height: 2px;background-color: black;"></div>
        <div class="registre_user">
            <div class="registre_user_left">
                <div>
                    <div class="font_one">就诊人：{{ patient_name }}</div>
                    <div class="font_two"></div>
                </div>
                <div class="font_two">
                    <div style="margin-top: 0.2rem;">身份证号：{{ id_number }}</div>
                </div>
                <div class="font_two">
                    <div style="margin-top: 0.2rem;">电话号码：{{ phone }}</div>
                </div>
            </div>
            <div class="registre_user_right">
                <el-button v-if="select_patients"  @click="select_patient" color="#752423">选择就诊人</el-button>
                <el-button v-else  @click="select_patient" color="#752423">切换就诊人</el-button>
            </div>
        </div>
        <div style="width: 100%;height: 2px;background-color: black;"></div>
        <div class="div_describe">
            <div style="font-size: 2rem;">病情描述</div>
            <div> <el-input v-model="describe" style="font-size: 1.5rem;" :autosize="{ minRows: 1, maxRows: 4 }" type="textarea" placeholder="请描述您的病症" /></div>
        </div>
        <div class="div_footer">
        <div class="cost">支付费用:{{ doctor?.registration_cost }}&nbsp元</div>
        <div class="cost_submit"><el-button color="#752423" @click="cost_submit">提交订单</el-button></div>
    </div>
    </div>

    <!-- 选择就诊卡弹窗 -->
    <div v-if="patient_card" class="patient_card">
        <div class="patient_main">
            <div class="patient_mains" v-for="(item, index) in PatientsCardlist" :key="item.id">
                <div class="patient_number">
                    <span>就诊卡{{ index + 1 }}</span>
                </div>
                <div class="patient_information">
                    <div class="patient_informations">
                        <div><span>姓名:</span></div>
                        <div><span>{{ item.name }}</span></div>
                    </div>
                    <div class="patient_informations">
                        <div><span>电话:</span></div>
                        <div><span>{{ item.phone }}</span></div>
                    </div>
                    <div class="patient_informations">
                        <div><span>身份证号:</span></div>
                        <div><span>{{ item.id_number }}</span></div>
                    </div>

                </div>
                <div class="patient_remove">
                    <el-button v-if="selected === index" type="success" :icon="Check" @click="selectCard(-1)" circle />
                    <el-button v-else type="info" :icon="Check" circle @click="selectCard(index)" />
                </div>
            </div>
        </div>

        <div class="add_patient">
            <div v-if="isPatient" class="add_patients" @click="add_patient">
                <span>添加就诊卡</span>
            </div>
            <div v-else class="add_patients" @click="select_patient_card">
                <span>确定</span>
            </div>
        </div>
    </div>
</template>



<style lang="less" scoped>
.div_top_time {
    height: 4.5rem;
    line-height: 4rem;
    font-size: 1.5rem;
    background-color: #752423;

    div {
        color: white;
        width: 90%;
        margin: auto;
        text-align: left;
        padding-left: 1rem;
    }
}

.div_register {
    background-color: #ffffff;
    width: 90%;
    border-radius: 1rem;
    position: absolute;
    top: 3.5rem;
    left: 2.5%;
    text-align: left;
    padding-left: 1rem;
    padding-top: 1rem;
}

.registre_doctor {
    display: flex;
    flex-direction: column;
}

.registre_doctors {
    display: flex;
    height: 2.5rem;
    line-height: 2.5rem;
}

.registre_user {
    display: flex;
    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
}

.registre_user_left {
    width: 65%;
}

.registre_user_right {
    width: 35%;
    justify-content: center;
    align-items: center;
    display: flex;
}

.font_one {
    color: black;
    font-size: 1.5rem;
}

.font_two {
    color: #6e6e6e;
}

.horizontal_line {
    background-color: #6e6e6e;
    height: 0.15rem;
    width: 8rem;
    left: -0.5rem;
    position: absolute;
    top: 1.1rem;
}

.original_registration {
    color: #6e6e6e;
    position: relative;
    font-size: 1.5rem;
}

.div_footer {
    background-color: #ffffff;
    width: 94%;
    height: 5rem;
    border-radius: 1rem;
    position: relative;
    left: 2.5%;
    line-height: 5rem;
    font-size: 1.5rem;
    display: flex;
    padding-bottom: 1rem;
}

.cost {
    width: 65%;
}

.cost_submit {
    width: 35%;
}

.patient_card {
    z-index: 999;
    width: 94%;
    background-color: #edf9f7;
    position: absolute;
    left: 2.5%;
    height: 30rem;
    border: 1px solid;
    overflow-y: scroll;
    border-radius: 1rem;
}

.add_patient {
    margin-top: 1rem;
    font-size: 2rem;

    .add_patients {
        width: 90%;
        margin: auto;
        background-color: #752423;
        border-radius: 1rem;
        height: 3.5rem;
        line-height: 3.5rem;

        span {
            color: white;
        }
    }
}

.patient_mains {
    display: flex;
    width: 85%;
    margin: auto;
    margin-top: 0.5rem;
    background-color: #ffffff;
    border-radius: 1.5rem;
    padding: 1rem;
    height: 7rem;
}

.patient_number {
    height: 100%;
    width: 7%;
    background: url('http://localhost:3000/public/uploads/2023-8-23/patient_card.png');
    background-size: 100% 90%;
    background-repeat: no-repeat;

    span {
        color: #ffffff;
    }

    padding: 0.4rem;
}

.patient_information {
    width: 78%;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 0.5rem;
    height: 8rem;
}

.patient_informations {
    display: flex;
    height: 33%;
}

.patient_remove {
    width: 15%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

}
.div_describe{
    margin-top: 1rem;
    margin-bottom: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    width: 85%;
    margin-left: 5%;
}
</style>