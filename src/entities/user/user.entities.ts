//用户信息类
export type User={
    id: number;
    openid: string;
    nickname: string;//名称
    city: string;//城市
    province: string;//省份
    country: string;//国家
    headimgurl: string;//头像
    authorize_time: string;//最后一次授权时间
}