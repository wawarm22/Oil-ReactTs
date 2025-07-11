import { useEffect, useState, useRef } from "react";
import { BsHourglassSplit, BsHourglassBottom } from "react-icons/bs";
import { motion, Transition, AnimationGeneratorType } from "framer-motion";

const stages = [
    { Icon: BsHourglassBottom, rotate: 0 },
    { Icon: BsHourglassBottom, rotate: 180 },
    { Icon: BsHourglassSplit, rotate: 180 },
    { Icon: BsHourglassBottom, rotate: 0 },
];

export default function HourglassStackLoading() {
    const [stage, setStage] = useState(0);
    const prevStage = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            prevStage.current = stage;
            setStage(s => (s + 1) % stages.length);
        }, 600);
        return () => clearInterval(interval);
    }, [stage]);

    const { Icon, rotate } = stages[stage];

    let transition: Transition = { duration: 0 };
    if (prevStage.current === 0 && stage === 1) {
        transition = { type: "tween" as AnimationGeneratorType, ease: "easeInOut", duration: 0.48 };
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 250 }}>
            <motion.div
                style={{
                    width: "120px",
                    height: "120px",
                    color: "#FFFF",
                    backgroundColor: "#FFCB02",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                animate={{ rotate }}
                transition={transition}
            >
                <Icon style={{ width: "70px", height: "70px" }} />
            </motion.div>
            <div className="fw-bold text-center mt-4" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: 22, color: "#1E2329" }}>
                กำลังประมวลผลการ OCR<br />กรุณารอสักครู่
            </div>
        </div>
    );
}
