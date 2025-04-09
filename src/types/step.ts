import { StepStatus } from "./enum/stepStatus";

export interface StepItem {
    id: number;
    label: string;
    status: StepStatus;
}

export const stepList: StepItem[] = [    
    { id: 1, label: "ตรวจสอบข้อมูล", status: StepStatus.AUDIT },
    { id: 2, label: "ตรวจสอบการเปรียบเทียบ", status: StepStatus.MATCH },
    { id: 3, label: "ยื่นแบบคำขอ", status: StepStatus.SUBMIT }
];
