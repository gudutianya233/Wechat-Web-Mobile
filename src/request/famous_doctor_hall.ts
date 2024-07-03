import { Doctor } from '../entities/doctor/doctor.entities'
import request from './request'



//名医堂的医生列表
export const getDoctorInformation = (name:string): Promise<Doctor[]> =>
  request.post('doctor/getDoctorInformation',{name}
  ).then((res: any) => {
    return res;
  })
    .catch((error) => {
      console.log("error", error);
    });

