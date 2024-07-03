<!-- 添加就诊卡 -->
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { savePatientsCard } from '../../request/patient_card_management';
import { PatientsCard } from '../../entities/user/patient_card.entities';
const route = useRoute();
const router = useRouter();
//用户id
const id = ref(0)
//添加就诊卡的初始化对象
let addPatientsCard: PatientsCard = {
    id: 0,
    name: '',
    userId: 0,
    phone: '',
    age: 0,
    sex: true,
    id_type: true,
    id_number: '',
    create_time: '',
    update_time: '',
};
//就诊卡人的名字
const add_name = ref('')
//就诊卡的电话
const add_phone = ref('')
//就诊卡的身份证号码
const add_id_number = ref('')
//年龄
const add_age = ref(0)
//性别
const add_sex = ref(true)
async function add() {
    if (add_name.value && add_phone.value && add_id_number.value) {
        if (validatePhone(add_phone.value)) {
            if (validateIdNumber(add_id_number.value)) {
                addPatientsCard.name = add_name.value
                addPatientsCard.userId = id.value
                addPatientsCard.phone = add_phone.value
                addPatientsCard.age = add_age.value
                addPatientsCard.sex = add_sex.value
                addPatientsCard.id_type = true
                addPatientsCard.id_number = add_id_number.value
                //console.log(addPatientsCard)
                const res: any = await savePatientsCard(addPatientsCard)
                if (res.code == 200) {
                    ElMessage({
                        message: `添加用户${add_name.value}的就诊卡成功`,
                        type: 'success',
                    })
                    router.go(-1)
                }
                else {
                    ElMessage({
                        message: `${res.message}`,
                        type: 'error',
                    })
                }
            }
            else {
                ElMessage({
                    message: `身份证号码不合法`,
                    type: 'error',
                })
            }
        }
        else {
            ElMessage({
                message: `手机号码不合法`,
                type: 'error',
            })
        }
        await init()
    } else {
        ElMessage({
            message: `有数据为空`,
            type: 'error',
        })
    }

}
//校验手机号码
function validatePhone(phone: string) {
    const pattern = /^1[3-9]\d{9}$/;
    return pattern.test(phone);
}
//校验身份证号码
function validateIdNumber(idNumber: string) {
    const coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkDigits = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    // 前17位数字
    const digits = idNumber.slice(0, -1);
    // 校验码
    const checkDigit = idNumber.slice(-1).toUpperCase();

    // 验证长度
    if (idNumber.length !== 18) {
        return false;
    }

    // 验证地区代码（这里只是一个简单的验证，你可能需要一个完整的地区代码列表来进行验证）
    const areaCode = idNumber.slice(0, 2);
    if (areaCode < '10' || areaCode > '66') {
        return false;
    }

    // 验证出生日期
    const birthDate = idNumber.slice(6, 14);
    const year = parseInt(birthDate.slice(0, 4), 10);
    const month = parseInt(birthDate.slice(4, 6), 10);
    const day = parseInt(birthDate.slice(6), 10);

    if (year < 1900 || year > new Date().getFullYear() || month < 1 || month > 12 || day < 1 || day > new Date(year, month, 0).getDate()) {
        return false;
    }

    // 验证校验码
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i]) * coefficients[i];
    }

    return checkDigits[sum % 11] === checkDigit;
}

onMounted(async () => {
    init()
})
async function init() {
    //从url地址取到用户id
    if (route.query.userId) {
        id.value = Number(route.query.userId);
    }
}
</script>
<template>
    <div class="Logo">
        <img src="http://localhost:3000/public/uploads/2023-8-23/logo.png" />
    </div>
    <div class="add_patient_show">
        <div class="div_addShow_content">
            <div class="div_addShow_name">
                <div><span>就诊卡人的名字：</span></div>
                <div> <el-input v-model="add_name" placeholder="请输入办卡人的姓名" /></div>
            </div>
            <div class="div_addShow_name">
                <div><span>电话号码：</span></div>
                <div> <el-input v-model="add_phone" placeholder="请输入办卡人的电话号码" pattern="^1[3-9]\\d{9}$" /></div>
            </div>
            <div class="div_addShow_name">
                <div><span>身份证号码：</span></div>
                <div> <el-input v-model="add_id_number" placeholder="请输入办卡人的身份证号码" /></div>
            </div>
            <div class="div_addShow_name">
                <div><span>年龄：</span></div>
                <div> <el-input v-model="add_age" placeholder="请输入办卡人的年龄" /></div>
            </div>
            <div class="div_addShow_name">
                <div><span>性别：</span></div>
                <div>
                    <el-switch v-model="add_sex" inline-prompt class="ml-2"
                        style="--el-switch-on-color: #409eff; --el-switch-off-color: #13ce66" active-text="男"
                        inactive-text="女" />
                </div>
            </div>

        </div>
    </div>
    <div class="see_more">
        <div @click="add">
            <span>添加</span>
        </div>
    </div>
</template>
<style lang="less" scoped>
.Logo {
    height: 4rem;
    width: 100%;

    img {
        height: 100%;
        width: 100%;
    }
}

.see_more {
    margin-top: 1rem;
    font-size: 2rem;

    div {
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

.div_addShow_content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 1rem;
}

.add_patient_show {
    background-color: #ffffff;
    width: 90%;
    border-radius: 1.5rem;
    margin: auto;
    margin-top: 1.5rem;
}

.div_addShow_name {
    width: 60%;
    line-height: 40px;
    text-align: left;
    margin: auto;
}</style>