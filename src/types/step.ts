import { StepStatus } from "./enum/stepStatus";

export interface StepItem {
    id: number;
    label: string;
    status: StepStatus;
}

export const stepList: StepItem[] = [    
    { id: 1, label: "ตรวจสอบข้อมูลแต่ละเอกสาร", status: StepStatus.AUDIT },
    { id: 2, label: "ขั้นตอนการตรวจสอบภาษี", status: StepStatus.MATCH },
    { id: 3, label: "ยืนยันการยื่นแบบคำขอ", status: StepStatus.SUBMIT }
];
