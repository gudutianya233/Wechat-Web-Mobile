import { UserEvaluate } from '../entities/user/user_evaluate.entities';
import request from './request';

/**
 * 获取指定openid的用户的已完成的订单信息
 * @param openid 
 * @returns 
 */
export const getEvaluate=(openid:string):Promise<any> =>
request.post('/user/getEvaluate',{openid}
).then((res:any) => {
    return res;
})
.catch((error) => {
  console.log("error", error);
});
/**
 * 用户点击完成订单，添加评价
 * @param userEvaluate 订单实体
 * @returns 
 */
export const saveUserEvaluateRegister=(userEvaluate:Partial<UserEvaluate>):Promise<any> =>
request.post('/user/saveUserEvaluateRegister',{userEvaluate}
).then((res:any) => {
    return res;
})
.catch((error) => {
  console.log("error", error);
});
/**
 * 查看评价
 * @param SystemNumber 系统订单号
 * @returns 
 */
export const seeUserEvaluate=(SystemNumber:string):Promise<any> =>
request.post('/user/seeUserEvaluate',{SystemNumber}
).then((res:any) => {
    return res;
})
.catch((error) => {
  console.log("error", error);
});
/**
 * 修改选中的评价信息
 * @param userEvaluate 修改后的评价
 * @returns 
 */
export const changeEvaluate=(userEvaluate:Partial<UserEvaluate>):Promise<any> =>
request.post('/user/changeEvaluate',{userEvaluate}
).then((res:any) => {
    return res;
})
.catch((error) => {
  console.log("error", error);
});