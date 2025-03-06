import { StepStatus } from "./enum/stepStatus";

export interface StepItem {
    id: number;
    label: string;
    status: StepStatus;
}

export const stepList: StepItem[] = [
    { id: 1, label: "อัปโหลดเอกสาร", status: StepStatus.UPLOAD },
    { id: 2, label: "ยืนยันการอัปโหลดเอกสาร", status: StepStatus.CONFIRM },
    { id: 3, label: "ตรวจสอบข้อมูล", status: StepStatus.AUDIT },
    { id: 4, label: "ตรวจสอบการเปรียบเทียบ", status: StepStatus.MATCH },
    { id: 5, label: "ยื่นแบบคำขอ", status: StepStatus.SUBMIT }
];
