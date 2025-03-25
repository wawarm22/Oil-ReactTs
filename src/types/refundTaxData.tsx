export interface TaxRefundRecord {
  id: number;
  factoryName: string;
  submittedDate: string; 
  amount: number;    
  status: "ตรวจสอบเอกสารเรียบร้อย" | "รอดำเนินการคืนภาษี";
}

export const taxRefundHistory: TaxRefundRecord[] = [
  {
    id: 1,
    factoryName: "คลังบ้านดอน",
    submittedDate: "01/02/68",
    amount: 10000000,
    status: "ตรวจสอบเอกสารเรียบร้อย",
  },
  {
    id: 2,
    factoryName: "คลังบ้านดอน",
    submittedDate: "01/01/68",
    amount: 10000000,
    status: "รอดำเนินการคืนภาษี",
  },
  {
    id: 3,
    factoryName: "คลังบ้านดอน",
    submittedDate: "01/12/67",
    amount: 10000000,
    status: "รอดำเนินการคืนภาษี",
  },
];
