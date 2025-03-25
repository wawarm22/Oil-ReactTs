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

export const horBarData = {
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

export const horBarOptions = {
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

export const verBarData = {
    labels: ["2563", "2564", "2565", "2566", "2567", "2568"],
    datasets: [
        {
            label: "จำนวนเรื่อง",
            data: [900, 800, 600, 750, 700, 500],
            backgroundColor: "#FF3130",
            borderRadius: 6,
            barThickness: 65,
        },
    ],
};

export const verBarOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context: any) => `${context.raw.toLocaleString()} เรื่อง`,
            },
        },
        datalabels: {
            anchor: "end" as const,
            align: "top" as const,
            color: "#000",
            font: {
                weight: "bold" as const,
                size: 14,
            },
            formatter: (value: number) => `${value.toLocaleString()}`,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "(จำนวนเรื่อง)",
                font: {
                    size: 14,
                    weight: "bold" as const,
                },
            },
            ticks: {
                stepSize: 250,
                callback: function (
                    this: any,
                    tickValue: string | number,                    
                ) {
                    return Number(tickValue).toLocaleString();
                },
            },
        },
        x: {
            title: {
                display: true,
                text: "(ปี)",
                font: {
                    size: 14,
                    weight: "bold" as const,
                },
            },
        },
    },
};



