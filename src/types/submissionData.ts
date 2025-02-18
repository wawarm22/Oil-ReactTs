export interface TaxRefundRequest {
  id: number;
  requestNumber: string;
  submissionDate: string;
  volume: string;
  details: string;
  status: "ตรวจสอบเอกสาร" | "ยื่นแบบคำขอ" | "ยื่นแบบคำขอสำเร็จ";
}

export const mockData: TaxRefundRequest[] = [
  {
    id: 1,
    requestNumber: "1234567890",
    submissionDate: "10/01/2025",
    volume: "3,213 ลิตร",
    details: "การยื่นลดหย่อนและการคืนภาษีน้ำมัน",
    status: "ตรวจสอบเอกสาร",
  },
  {
    id: 2,
    requestNumber: "9810380941",
    submissionDate: "10/12/2024",
    volume: "1,948 ลิตร",
    details: "การยื่นลดหย่อนและการคืนภาษีน้ำมัน",
    status: "ยื่นแบบคำขอ",
  },
  {
    id: 3,
    requestNumber: "1498239839",
    submissionDate: "10/11/2024",
    volume: "1,948 ลิตร",
    details: "การยื่นลดหย่อนและการคืนภาษีน้ำมัน",
    status: "ตรวจสอบเอกสาร",
  },
  {
    id: 4,
    requestNumber: "1238918499",
    submissionDate: "10/10/2024",
    volume: "1,308 ลิตร",
    details: "การยื่นลดหย่อนและการคืนภาษีน้ำมัน",
    status: "ตรวจสอบเอกสาร",
  },
  {
    id: 5,
    requestNumber: "8887578932",
    submissionDate: "10/09/2024",
    volume: "1,241 ลิตร",
    details: "การยื่นลดหย่อนและการคืนภาษีน้ำมัน",
    status: "ยื่นแบบคำขอ",
  },
  {
    id: 6,
    requestNumber: "2094759283",
    submissionDate: "10/08/2024",
    volume: "2,391 ลิตร",
    details: "การยื่นลดหย่อนและการคืนภาษีน้ำมัน",
    status: "ยื่นแบบคำขอสำเร็จ",
  },
  {
    id: 7,
    requestNumber: "3910940918",
    submissionDate: "10/07/2024",
    volume: "1,368 ลิตร",
    details: "การยื่นลดหย่อนและการคืนภาษีน้ำมัน",
    status: "ยื่นแบบคำขอสำเร็จ",
  },
];
