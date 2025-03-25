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

export const barData = {
    labels: ["2563", "2564", "2565", "2566", "2567"],
    datasets: [
        {
            label: "จำนวนเงินขอลดหย่อนภาษีทั้งหมด",
            data: [13273275, 16270223, 12649785, 14575755, 16365308],
            backgroundColor: "#FFCC01",
            borderRadius: 8,
            barThickness: 30,
        },
        {
            label: "จำนวนภาษีที่ได้รับการลดหย่อนและได้คืน",
            data: [7842498, 9885522, 5989066, 8710884, 10928771],
            backgroundColor: "#55D88C",
            borderRadius: 8,
            barThickness: 30,
        },
    ],
};

export const barOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
        legend: {
            position: "bottom" as const,
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const value = context.raw.toLocaleString();
                    return `${context.dataset.label}: ${value} บาท`;
                },
            },
        },
    },
    scales: {
        x: {
            ticks: {
                callback: (value: any) => value.toLocaleString(),
            },
        },
    },
};

