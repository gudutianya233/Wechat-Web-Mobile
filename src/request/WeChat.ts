import requests from "./request";
  //获取用户授权
export const getUserAuthorize = (): Promise<string> => {
  return requests.get('/auth/getUserAuthorize', {params: { redirect_uri: window.location.href }})
    .then((res: any) => {
      console.log('getUserAuthorize',res)
      return res;
    })
    .catch((error) => {
      console.log("error", error);
    })
}


//网页授权后后台第一次获取用户信息并保存到数据库中，给前台只返回openid
  export const getUserInfo = (code: string): Promise<string> =>
  requests
    .post("/user/signin", { params: { code: code } })
    .then((res:any) => {
        return res;
    })
    .catch((error) => {
      console.log("error", error);
    });
type params={
  noncestr:string,
  timestamp:number,
  url:string,
}
  //后端加密得到签名(配置wx.config)
export const getSignature=(params:params): Promise<string> =>
requests
  .post("/user/getSignature",{params})
  .then((res:any) => {
 //   console.log("getSignature", res);
 return res;
  })
  .catch((error) => {
    console.log("error", error);
  });
  
  type paramss={
    appId:string,
    timestamp: number,
    nonceStr: string,
    package:string
  }
  //后端加密得到签名(配置wx.chooseWXPay)
  export const getPaySign=(params:paramss): Promise<string> =>
requests
  .post("/user/getPaySign",{params})
  .then((res:any) => {
 //   console.log("getPaySign", res);
  return res
  })
  .catch((error) => {
    console.log("error", error);
  });
  