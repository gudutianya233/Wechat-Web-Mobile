//医生类
export type Doctor={
    id:number;
    name:string;//医生名字
    title: string;//医生的头衔
    head__picture: string;//医生的头像
    consultation_instructions:string;//坐诊说明
    original_registration_cost:number;//原价挂号费
    registration_cost:number;// 挂号费
    attention:number;//关注数量
    receive_number:number;//挂号量
    favorable_rate:number;//好评率
    switch:boolean;//医生状态(是否坐诊)
    overview_content:string;//医生简介
    create_time:string//创建时间
}