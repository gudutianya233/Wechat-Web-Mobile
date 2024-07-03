import { PatientsCard } from '../entities/user/patient_card.entities'
import { UserRegister } from '../entities/user/user_register'
import request from './request'




//获取当前用户的就诊卡
export const getUserPatientsCardWeChat = (userId: number): Promise<PatientsCard[]> =>
    request.post('user/getUserPatientsCardWeChat', { userId }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//删除选中的就诊卡
export const removePatientsCard = (id: number): Promise<string> =>
    request.post("/user/removePatientsCard", { id }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//添加就诊卡
export const savePatientsCard = (patientsCard: PatientsCard): Promise<string> =>
    request.post("/user/savePatientsCard", { patientsCard }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//用户提交订单,还没有输入密码支付
export const userRegisterPlaceOrder = (userRegister: UserRegister): Promise<string> =>
    request.post("/user/userRegisterPlaceOrder", { userRegister }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//用户在我的预约中点击待支付的订单
export const reservationPlaceOrder = (userRegister: UserRegister): Promise<string> =>
    request.post("/user/reservationPlaceOrder", { userRegister }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//用户在我的预约中点击已支付的订单申请退款
export const userWeChatRefund = (userRegister: UserRegister): Promise<string> =>
    request.post("/user/userWeChatRefund", { userRegister }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//未就诊的订单发起退款/退款失败的订单发起退款
export const userWeChatCancel = (userRegister: UserRegister): Promise<string> =>
    request.post("/user/userWeChatCancel", { userRegister }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });


//获得当前用户的挂号情况
export const getUserRegister = (userId: number): Promise<UserRegister[]> =>
    request.post("/user/getUserRegister", { userId }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
