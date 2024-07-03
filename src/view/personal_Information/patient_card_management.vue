<!-- 就诊卡页面 -->
<script lang="ts" setup>
import { ElMessage, ElPopconfirm } from 'element-plus';
import { PatientsCard } from '../../entities/user/patient_card.entities';
import { getUserPatientsCardWeChat, removePatientsCard } from '../../request/patient_card_management';
import { InfoFilled } from '@element-plus/icons-vue'
import { Delete } from '@element-plus/icons-vue'
const router = useRouter();
const route = useRoute();
//用户id
const id = ref(0)
//就诊卡列表
const PatientsCardlist: Ref<PatientsCard[] | null> = ref(null)

//删除选中的就诊卡
async function remove(id: number) {
    const res:any = await removePatientsCard(id)
    if (res.code==200) {
        ElMessage({
            message: `删除成功`,
            type: 'success',
        })
    }
    else {
        ElMessage({
            message: `${res.message}`,
            type: 'error',
        })
    }
    init()
}
//添加就诊卡跳转
function add_patient() {
    const userId = id.value
    router.push({ name: 'add_patient_card', query: { userId } });
}
async function init() {
    //从url地址取到用户id
    if (route.query.userId) {
        id.value = Number(route.query.userId);
    }
    const res = await getUserPatientsCardWeChat(id.value)
    if (res) {
        PatientsCardlist.value = res
    }
}
onMounted(async () => {
    init()
})
</script>
<template>
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
                <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                    icon-color="#626AEF" :title="`确认删除` + `${item.name}` + `的就诊卡${index + 1}吗?`" @confirm="remove(item.id)">
                    <template #reference>
                        <el-button :icon="Delete" circle size="large" />
                    </template>
                </el-popconfirm>
            </div>
        </div>
    </div>

    <div class="add_patient">
        <div class="add_patients" @click="add_patient">
            <span>添加就诊卡</span>
        </div>
    </div>
</template>
<style lang="less" scoped>
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
</style>

