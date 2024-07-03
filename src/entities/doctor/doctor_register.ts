//医生预约类
export type DoctorRegister={
    id:number;
    doctorId:number;//医生id
    patientId:number;//就诊卡id
    patient_name:string;//就诊人的名字
    phone:string;//就诊人的号码
    work_time:string;//就诊人的挂号的日期
    status:number;//就诊人的挂号的时间的具体上午还是下午
    create_time:string;//预约的创建时间
    update_time:string;//预约的修改时间
    doctor_status:number;//就诊状态(0=待就诊，1=完成，2=待退款，3=已退款)
}