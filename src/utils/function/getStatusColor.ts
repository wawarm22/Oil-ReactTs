export const getStatusColor = (status: string): string => {
    switch (status) {
        case "ตรวจสอบเอกสาร":
            return "#DD3A30";
        case "ยื่นแบบคำขอ":
            return "#FFCC01";
        case "ยื่นแบบคำขอสำเร็จ":
            return "#22C659";
        default:
            return "gray";
    }
};
