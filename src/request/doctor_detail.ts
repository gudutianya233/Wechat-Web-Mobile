import { DoctorInfo } from '../entities/doctor/doctor_info.entities';
import { UserEvaluate } from '../entities/user/user_evaluate.entities';
import { WorkTime } from '../entities/doctor/work_time.entities';
import { Doctor } from '../entities/doctor/doctor.entities';
import request from './request';




//获取指定id的医生详细信息
export const getDoctorAllInformation = (id: string): Promise<DoctorInfo> =>
  request.post('/doctor/getDoctorAllInformation', { id: id }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });

//先根据openid获取用户ID
export const getUserId = (openId: string): Promise<number> =>
  request.post('/user/getUserId', { openId: openId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });
//根据userId，doctorId查询是否关注此医生
export const checkIfUserFollowsDoctor = (userId: number, doctorId: Number): Promise<boolean> =>
  request.post('/user/checkIfUserFollowsDoctor', { userId: userId, doctorId: doctorId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });

//当前用户关注当前医生
export const userFollowDoctor = (userId: number, doctorId: Number, openId: string): Promise<boolean> =>
  request.post('/user/userFollowDoctor', { userId: userId, doctorId: doctorId, openId: openId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });

//当前用户取消关注当前医生
export const userCancellationFollowDoctor = (userId: number, doctorId: Number): Promise<boolean> =>
  request.post('/user/userCancellationFollowDoctor', { userId: userId, doctorId: doctorId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });

//获取5条当前医生的评价
export const getUserEvaluateWeChat = (skip: number, take: number, doctorId: string): Promise<UserEvaluate[]> =>
  request.post('/user/getUserEvaluateWeChat', { skip, take, doctorId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });

//获得当前医生通过的评价条数
export const getUserEvaluateWeChatCount = (doctorId: string): Promise<number> =>
  request.post('/user/getUserEvaluateWeChatCount', { doctorId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });
//得到当前医生的出诊安排表的id
export const getDoctorWorkId = (doctorId: string): Promise<string> =>
  request.post('/doctor/getDoctorWorkId', { doctorId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });
//获得当前医生的出诊时间
export const getDoctorWorkTime = (doctorId: string, doctorWorkId: string): Promise<WorkTime[]> =>
  request.post('/doctor/getDoctorWorkTime', { doctorId, doctorWorkId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });
//挂号页面获取指定医生id的信息
export const getRegisterDoctor = (doctorId: number): Promise<Doctor> =>
  request.post('/doctor/getRegisterDoctor', { doctorId }
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });