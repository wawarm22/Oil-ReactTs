export const pieData = {
    labels: ["คืนภาษีสำเร็จ", "ต้องชำระเพิ่ม", "กำลังตรวจสอบ"],
    datasets: [
        {
            data: [20, 10, 10],
            backgroundColor: ["#5AD87F", "#FF7952", "#4D97FD"],
        },
    ],
};

export const pieOptions = {
    plugins: {
        legend: {
            display: false,
        },
    },
};
