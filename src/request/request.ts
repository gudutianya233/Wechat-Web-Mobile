import axios from 'axios'
import { getUserAuthorize } from './WeChat';
// import router from '../routes/index'
// 创建axios实例
const requests = axios.create({
   baseURL: 'http://localhost:3000',// 
    timeout: 80000, // 请求超时时间(毫秒)
    withCredentials: false,// 异步请求携带cookie
})

// requests请求拦截器
requests.interceptors.request.use(
    async   config => {
        const token = localStorage.getItem("auth_token");
        //  添加请求头
       config.headers["Authorization"] =token 
         // 检查是否在登录页
    if (window.location.pathname !== "/") {             
        try {
            if (token!=null) {
              //  console.log('auth_token:' + token)
                // 解析token的有效期
                const payload = JSON.parse((token.split('.')[0]));
               // console.log('exp:' + payload.exp)
                //  获得当前时间的秒数
                const now = Math.floor(Date.now() / 1000);
               // console.log('now:' + now)
                //如果token在5分钟内过期，就刷新token(实现无感刷新token)
                if (payload.exp - now < 5*60) {
                    try {
                       const response = await axios.post('http://localhost:3000/jwt/refresh', { refreshToken: token },{
                            headers:{
                                'Authorization':token
                            }
                        });
                        //console.log(response)
                        if (response.data.code === 200) {
                            const tokens = response.data.token;
                            localStorage.setItem("auth_token", tokens);
                        } else {
                            // 刷新token失败，显示错误信息并引导用户重新登录
                            alert('自动登录中···');
                            // router.push({ name: 'index' }); // 重定向到根目录
                            localStorage.clear()
                            //清除所有的localStorage，让用户重新进行授权
                            await getUserAuthorize().then((res: any) => {
                                const url = res.url;
                                window.location.href = url;
                            });
                        }
                    } catch (error) {
                        // 请求刷新token接口出错，显示错误信息并引导用户重新登录
                        //清除所有的localStorage，让用户重新进行授权
                        alert('自动登录中···');
                        // router.push({ name: 'index' }); // 重定向到根目录
                        localStorage.clear()
                        //清除所有的localStorage，让用户重新进行授权
                        await getUserAuthorize().then((res: any) => {
                            const url = res.url;
                            window.location.href = url;
                        });
                    }
                }            
            }
            else{
                //一般情况下不会执行到这里
                //没有token，引导用户重新打开网页
                await getUserAuthorize().then((res: any) => {
                    const url = res.url;
                    window.location.href = url;
                });

            }
        } catch (error) {
            console.log(error)
        }
    }
         return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)
// response 响应拦截器
requests.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response.data
    },
    error => {
        // 对响应错误做点什么
        console.log(error)
        localStorage.setItem("auth_token", "");
        return Promise.reject(error)
    }
)
export default requests