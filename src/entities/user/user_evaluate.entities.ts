//用户评价
export type UserEvaluate={
    id:number;
    doctorId:number;//医生id
    SystemNumber:string;//系统订单号
    doctor_name: string;//医生名字
    doctor:any;//医生实体
    stars: number;//评价星星数量(1-5)
    evaluate_name:string;//评价人的名字(就诊人)
    content: string;//评价内容
    create_time: string;//评价的创建时间
    update_time: string;//修改时间
    status: boolean;//状态
}