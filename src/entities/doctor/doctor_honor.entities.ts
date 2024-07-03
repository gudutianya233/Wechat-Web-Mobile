//医生的荣誉图片
export type DoctorHonor={
    id:number;
    doctorId:number;//医生id
    name:string;//医生名字
    url:string;//荣誉图片地址
    create_time:string;//图片上传时间
    update_time:string;//图片修改时间
    honor_type:string;//图片类型
    create_staff:string;//图片上传人
    status:boolean;//状态
}