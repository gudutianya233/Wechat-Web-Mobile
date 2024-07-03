import {User} from '../entities/user/user.entities'
import {CommonFunction} from '../entities/user/common_function.entities'
import request from './request';


//获取指定openid的用户信息
export const getUserInformation=(openid:string):Promise<User> =>
request.post('/user/getUserInformation',{openid}
).then((res:any) => {
    return res;
})
.catch((error) => {
  console.log("error", error);
});

//获取用户常用功能
export const getCommonFunction=():Promise<CommonFunction[]>=>
request.get('/user/getCommonFunction'
).then((res:any) => {
 return res;
})
.catch((error) => {
  console.log("error", error);
});