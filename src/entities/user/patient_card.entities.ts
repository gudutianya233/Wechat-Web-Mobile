//就诊卡类
export type PatientsCard={
    id:number;
    name:string;//就诊人名字
    userId:number;//用户表id
    phone:string;  //电话号码
    age:number;  //年龄
    sex:boolean;//性别(1=男，0=女)
    id_type:boolean;//绑定证件类型(1=身份证,0=其他)
    id_number: string;  //绑定的证件号码
    create_time: string;//创建时间
    update_time: string;//修改时间
    }