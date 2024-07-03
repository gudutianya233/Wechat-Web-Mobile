import { Doctor } from '../entities/doctor/doctor.entities';
import request from './request';




//获取指定userId的用户关注的医生列表
export const getUserFollowInfo = (userId: number): Promise<Doctor[]> =>
    request.post('/user/getUserFollowInfo', { userId }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
