import { StepStatus } from "./enum/stepStatus";

export interface StepItem {
    id: number;
    label: string;
    status: StepStatus;
}

export const stepList: StepItem[] = [
    { id: 1, label: "อัปโหลดเอกสาร", status: StepStatus.UPLOAD },
    { id: 2, label: "ยืนยันการอัปโหลดเอกสาร", status: StepStatus.CONFIRM },
    { id: 3, label: "ตรวจสอบเอกสาร", status: StepStatus.REVIEW },
    { id: 4, label: "ยื่นแบบคำขอ", status: StepStatus.SUBMIT }
];
