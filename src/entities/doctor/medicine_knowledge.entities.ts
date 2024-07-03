//医生的中医小知识类
export type MedicineKnowledge={
id:number;
doctorId:number;//关联医生
title:string;//标题
content:string;//内容
cover_image:string;//封面图片
isSwitch:boolean;//状态
read_number:number;//阅读量   
like_number:number;//点赞量   
create_time:string;//创建时间
create_staff:string;//创建人
}