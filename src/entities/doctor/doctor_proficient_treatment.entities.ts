//医生擅长治疗
export type DoctorProficientTreatment={
    id:number;
    doctorId:number;//医生id
    name:string;//医生名字
    subjects:string;//科目名字
    proficient_treatment:string;//擅长治疗的具体病症
    create_time:string;//创建时间
    update_time:string;//修改时间
    create_staff:string;//创建人
    status:boolean;//状态
}