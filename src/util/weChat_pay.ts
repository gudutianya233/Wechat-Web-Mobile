// 导入微信支付的JS SDK
import { ElMessage } from "element-plus";
//import {wx,WeixinJSBridge} from "weixin-jsapi";
import wx from "weixin-js-sdk";
// 定义一个方法，接收支付参数
export async function wxPay(params: any) {
  //console.log('params',params)
  // 配置微信支付的config
    await  wx.config({ 
        debug: false, // 是否开启调试模式 
        appId: params.appId, // 必填，公众号的唯一标识 
        timestamp: params.timestamp, // 必填，生成签名的时间戳 
        nonceStr: params.nonceStr, // 必填，生成签名的随机串 
        signature: params.signature, // 必填，签名 
        jsApiList: ['chooseWXPay'], // 必填，需要使用的JS接口列表
      }); 

   // 调用微信支付的chooseWXPay方法
   await wx.ready(async function(){
    await wx.chooseWXPay({
      timestamp: params.timestamp, // 必填，生成签名的时间戳
      nonceStr: params.nonceStr, // 必填，生成签名的随机串 
      package: params.packages, // 微信的prepay_id 
      signType:'RSA', // 加密方式  
      paySign:params.paySign, // 必填，签名 
        success: function (res: any) {
          // 支付成功后的回调函数
          if (res.errMsg === "chooseWXPay:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            ElMessage({ message: `支付成功`, type: 'success', });
            return {code:200,message:'支付成功'}
            //后台接口获得微信的支付通知，来判断是否支付成功
        }
          // TODO: 处理支付成功后的逻辑
        },
        fail: function () {
          // 支付失败后的回调函数
          ElMessage({ message: `支付失败,请在我的预约中重新支付此订单`, type: 'error', });
          return {code:403,message:'支付失败'}
          // TODO: 处理支付失败后的逻辑
        },
        cancel: function () {
          // 用户取消支付后的回调函数
          ElMessage({ message: `取消支付,请在我的预约中查看此订单`, type: 'info', });
          return {code:402,message:'取消支付'}
          // TODO: 处理用户取消支付后的逻辑
        },
      });
   })
}
