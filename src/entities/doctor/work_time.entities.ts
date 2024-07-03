//医生出诊具体时间
export type WorkTime={
    id:number;
    doctorId:number;//医生id
    name:string;//医生名字
    doctorWorkId:string;//医生的排班安排表id
    create_time:string;//创建时间
    update_time:string;//修改时间
    work_time: string;//出诊时间(yyyy-mm-dd)
    status:number;  //出诊情况(0=休息，1=全天，2=上午，3=下午)
    register_number:number;//当日当前医生剩余号数
}