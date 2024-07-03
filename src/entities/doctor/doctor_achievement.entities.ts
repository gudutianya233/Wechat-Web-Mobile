//医生的成就
export type DoctorAchievement={
    id:number;
    doctorId:number;//医生id
    name:string;//医生名字
    title:string;//成就的具体名字
    create_staff: string;//创建人
    create_time: string;//创建时间
    update_time: string;//编辑时间
    status:boolean;//状态
}