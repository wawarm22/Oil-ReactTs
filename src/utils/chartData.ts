import { ScriptableContext } from "chart.js";

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
        datalabels: {
            display: false,
        },
    },
};


export const horBarData = {
    labels: ["2563", "2564", "2565", "2566", "2567"],
    datasets: [
        {
            label: "จำนวนเงินขอลดหย่อนภาษีทั้งหมด",
            // data: [13273275, 16270223, 12649785, 14575755, 16365308],
            data: [0, 0, 0, 0, 0],
            backgroundColor: "#FFCC01",
            borderRadius: 8,
            barThickness: 30,
        },
        {
            label: "จำนวนภาษีที่ได้รับการลดหย่อนและได้คืน",
            // data: [7842498, 9885522, 5989066, 8710884, 10928771],
            data: [0, 0, 0, 0, 0],
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
                    return `${context.dataset.label}: ${value}`;
                },
            },
        },
        datalabels: {
            display: false,
        },
        // datalabels: {
        //     anchor: 'end' as const,
        //     align: 'start' as const,
        //     clamp: true,
        //     color: '#151513',
        //     font: {
        //         size: 22,
        //         family: "IBM Plex Sans Thai",
        //     },
        //     formatter: (value: number) => `${value.toLocaleString()}`,
        // }
    },
    scales: {
        x: {
            ticks: {
                callback: (value: any) => value.toLocaleString(),
            },
        },
    },
};

export const monthlyBarData = {
    labels: [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ],
    datasets: [
        {
            label: "จำนวนเงินขอลดหย่อนภาษีทั้งหมด",
            // data: [1000000, 1200000, 1100000, 1300000, 900000, 1150000, 950000, 1400000, 1250000, 1350000, 1280000, 1500000],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "#FFCC01",
            borderRadius: 8,
            barThickness: 30,
        },
        {
            label: "จำนวนภาษีที่ได้รับการลดหย่อนและได้คืน",
            // data: [700000, 800000, 750000, 900000, 600000, 850000, 700000, 950000, 870000, 910000, 890000, 980000],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "#55D88C",
            borderRadius: 8,
            barThickness: 30,
        },
    ],
};

export const monthlyBarOptions = {
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
        datalabels: {
            display: false,
        },
        // datalabels: {
        //     anchor: 'end' as const,
        //     align: 'start' as const,
        //     clamp: true,
        //     color: '#151513',
        //     font: {
        //         size: 22,
        //         family: "IBM Plex Sans Thai",
        //     },
        //     formatter: (value: number) => `${value.toLocaleString()}`,
        // }
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
            // data: [900, 800, 600, 750, 700, 500],
            data: [0, 0, 0, 0, 0, 0],
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

export const verBarDataMonthly = {
    labels: [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
    ],
    datasets: [
        {
            label: "จำนวนเรื่อง",
            // data: [75, 82, 91, 68, 70, 95, 88, 60, 77, 85, 79, 90],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "#FF3130",
            borderRadius: 6,
            barThickness: 65,
        },
    ],
};

export const verBarOptionsMonthly = {
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
                stepSize: 25,
                callback: function (this: any, tickValue: string | number) {
                    return Number(tickValue).toLocaleString();
                },
            },
        },
        x: {
            title: {
                display: true,
                text: "(เดือน)",
                font: {
                    size: 14,
                    weight: "bold" as const,
                },
            },
        },
    },
};

export const lineChartData = {
    labels: ["2563", "2564", "2565", "2566", "2567", "2568"],
    datasets: [
        {
            label: "จำนวนเงินขอลดหย่อนภาษีทั้งหมด",
            // data: [11363411, 16365308, 14575755, 12649785, 16270223, 13273275],
            data: [0, 0, 0, 0, 0, 0],
            borderColor: "#FFCC01",
            backgroundColor: "#FFCC01",
            tension: 0,
            pointRadius: (ctx: ScriptableContext<"line">) => ctx.dataIndex === 0 ? 0 : 8,
            pointHoverRadius: 12,
            pointBorderColor: "#FFCC01",
            pointBackgroundColor: "#FFE372",
            pointBorderWidth: 2,
        },
        {
            label: "จำนวนภาษีที่ได้รับการลดหย่อนและได้คืน",
            // data: [6632098, 10928771, 8710884, 5989066, 9885522, 7842498],
            data: [0, 0, 0, 0, 0, 0],
            borderColor: "#5AD87F",
            backgroundColor: "#5AD87F",
            tension: 0,
            pointRadius: (ctx: ScriptableContext<"line">) => ctx.dataIndex === 0 ? 0 : 8,
            pointHoverRadius: 12,
            pointBackgroundColor: "#82F4A3",
            pointBorderColor: "#5AD87F",
            pointBorderWidth: 2,
        },
    ],
};

export const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom" as const,
        },
        tooltip: {
            callbacks: {
                label: (context: any) =>
                    `${context.dataset.label}: ${context.raw.toLocaleString()} บาท`,
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
            formatter: function (value: number, ctx: any) {
                if (ctx.dataIndex === 0) return "";
                return `${value.toLocaleString()} บาท`;
            },
        },
    },
    scales: {
        y: {
            title: {
                display: true,
                text: "(บาท)",
                font: {
                    size: 14,
                    weight: "bold" as const,
                },
            },
            ticks: {
                callback: function (
                    this: any,
                    tickValue: string | number
                ) {
                    return Number(tickValue).toLocaleString();
                },
            },
        },
    },
};

export const lineMonthlyData = {
    labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
    datasets: [
        {
            label: "จำนวนเงินขอลดหย่อนภาษีทั้งหมด",
            // data: [827048, 1023490, 979131, 844451, 1256870, 980983, 851549, 989990, 937952],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: "#FFCC01",
            backgroundColor: "#FFCC01",
            tension: 0,
            pointRadius: (ctx: ScriptableContext<"line">) => ctx.dataIndex === 0 ? 0 : 8,
            pointHoverRadius: 12,
            pointBorderColor: "#FFCC01",
            pointBackgroundColor: "#FFE372",
            pointBorderWidth: 2,
        },
        {
            label: "จำนวนภาษีที่ได้รับการลดหย่อนและได้คืน",
            // data: [632098, 885694, 710884, 499066, 885522, 742498, 664884, 898917, 709644],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: "#5AD87F",
            backgroundColor: "#5AD87F",
            tension: 0,
            pointRadius: (ctx: ScriptableContext<"line">) => ctx.dataIndex === 0 ? 0 : 8,
            pointHoverRadius: 12,
            pointBackgroundColor: "#82F4A3",
            pointBorderColor: "#5AD87F",
            pointBorderWidth: 2,
        },
    ],
};

export const lineMonthlyOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom" as const,
        },
        tooltip: {
            callbacks: {
                label: (context: any) =>
                    `${context.dataset.label}: ${context.raw.toLocaleString()} บาท`,
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
            formatter: function (value: number, ctx: any) {
                if (ctx.dataIndex === 0) return "";
                return `${value.toLocaleString()} บาท`;
            },
        },
    },
    scales: {
        y: {
            title: {
                display: true,
                text: "(บาท)",
                font: {
                    size: 14,
                    weight: "bold" as const,
                },
            },
            ticks: {
                callback: function (this: any, tickValue: string | number) {
                    return Number(tickValue).toLocaleString();
                },
            },
        },
    },
};






