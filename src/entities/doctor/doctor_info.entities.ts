import { Doctor } from "./doctor.entities";
import { DoctorAchievement } from "./doctor_achievement.entities";
import { DoctorHonor } from "./doctor_honor.entities";
import { DoctorProficientTreatment } from "./doctor_proficient_treatment.entities";

export class DoctorInfo {
    doctorHonor: DoctorHonor[];
    doctorAchievement: DoctorAchievement[];
    doctorProficientTreatment: DoctorProficientTreatment[];
    doctor: Doctor;
    constructor(doctorHonor: DoctorHonor[], doctorAchievement: DoctorAchievement[], doctorProficientTreatment: DoctorProficientTreatment[], doctor: Doctor) {
        this.doctorHonor = doctorHonor;
        this.doctorAchievement = doctorAchievement;
        this.doctorProficientTreatment = doctorProficientTreatment;
        this.doctor = doctor;
    }
}