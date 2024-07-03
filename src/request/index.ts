import { Announcement } from '../entities/announcement.entities'
import { SwiperImage } from '../entities/swiperImage.entities'
import { Doctor } from '../entities/doctor/doctor.entities'
import { HospitalHonor } from '../entities/hospital_honor.entities'
import { CommondAbility } from '../entities/commond_ability.entities'
import request from './request'



//获得已发布轮播图的所有图片
export const getReleaseSwiperImage = (): Promise<SwiperImage[]> =>
    request.get('swiperImage/getReleaseSwiperImage'
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });


//获取最新的一条公告
export const getLatestAnnouncement = (): Promise<Announcement> =>
    request.get('/other/getLatestAnnouncement'
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });

//获得已发布的公告条数
export const getAnnouncementCount = (): Promise<number> =>
    request.get('/other/getAnnouncementCount'
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });

interface GetAnnouncementResponse {
    announcements: Announcement[];
    hasMore: boolean;
}

//获得5条已发布的公告
export const getAnnouncement = (skip: number, take: number): Promise<GetAnnouncementResponse> =>
    request.post('/other/getAnnouncement', { skip, take }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });

//首页获取医生的简单信息列表
export const getDoctorSimpleInformation = (): Promise<Doctor[]> =>
    request.get('/doctor/getDoctorSimpleInformation'
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });

//获取医馆的荣誉图片
export const getHospitalHonor = (): Promise<HospitalHonor[]> =>
    request.get('/hospital/getHospitalHonorImage'
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//获得首页的常用功能
export const getCommondAbility = (): Promise<CommondAbility[]> =>
    request.get('/function/getCommondAbility'
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
//获得授权的auth_token
export const loginWeChat = (openid: string): Promise<GetAnnouncementResponse> =>
    request.post('/jwt/loginWeChat', { openid }
    ).then((res: any) => {
        return res;
    })
        .catch((error) => {
            console.log("error", error);
        });
