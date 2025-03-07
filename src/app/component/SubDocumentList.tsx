import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { documentList } from "../../types/docList";

interface SubDocumentListProps {
    selectedId: number | null;
}

const SubDocumentList: React.FC<SubDocumentListProps> = ({ selectedId }) => {
    const selectedCategory = documentList.find(doc => doc.id === selectedId);
    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);

    useEffect(() => {
        if (selectedCategory && selectedCategory.documents.length > 0) {
            setSelectedSubId(0);
        }
    }, [selectedId]);

    const handleSubClick = (index: number) => {
        setSelectedSubId(index);
    };

    return (
        <div className="container-fluid d-flex justify-content-start align-items-start shadow-sm bg-white rounded-2 m-0 mt-3" style={{ padding: "25px 35px", maxWidth: "1020px" }}>
            <div className="d-flex flex-column align-items-start w-100">
                <p className="fw-bold text-start ms-2 mb-0" style={{ fontSize: "26px", fontFamily: "IBM Plex Sans Thai" }}>
                    รายการเอกสารที่ใช้
                </p>

                {selectedCategory && (
                    <div className="d-flex flex-wrap justify-content-start">
                        {selectedCategory.documents.map((doc, index) => (
                            <motion.div
                                key={index}
                                className="border border-dark border-2 rounded-2 m-2 py-2 px-3"
                                style={{
                                    width: '240px',
                                    height: "auto",
                                    backgroundColor: selectedSubId === index ? "#3D4957" : "#ffffff",
                                    color: selectedSubId === index ? "#ffffff" : "#000000",
                                    cursor: 'pointer'
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 4px 8px rgba(2, 29, 58, 0.56)",
                                    transition: { duration: 0.3 },
                                }}
                                whileTap={{
                                    scale: 0.98,
                                    transition: { duration: 0.2 },
                                }}
                                onClick={() => handleSubClick(index)}
                            >
                                <p className="m-0 fw-bold" style={{ fontSize: "18px" }}>{doc}</p>
                            </motion.div>

                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubDocumentList;
