import React from 'react';
import { documentList } from "../../types/docList";
import { motion } from 'framer-motion';

// รับ props จาก DocumentAudit.tsx
interface AuditListProps {
    selectedId: number | null;
    setSelectedId: (id: number | null) => void;
}

const AuditList: React.FC<AuditListProps> = ({ selectedId, setSelectedId }) => {

    const handleClick = (id: number) => {
        setSelectedId(id);
    };

    return (
        <div className="container-fluid d-flex justify-content-center shadow-sm py-4 bg-white rounded-2 w-100 mt-3" style={{ fontFamily: 'Sarabun' }}>
            <div className="d-flex flex-column align-items-start" style={{ maxWidth: '1800px' }}>
                <p className="fw-bold text-start ms-2" style={{ fontSize: "26px", fontFamily: "IBM Plex Sans Thai" }}>
                    รายการตรวจสอบเอกสาร
                </p>
                <div className="d-flex flex-wrap justify-content-center">
                    {documentList.map((doc) => (
                        <motion.div
                            key={doc.id}
                            className="d-flex flex-column justify-content-start align-items-start border border-dark border-2 rounded-2 mx-2 py-2 px-3"
                            style={{
                                width: '325px',
                                height: '135px',
                                backgroundColor: selectedId === doc.id ? "#3D4957" : "#ffffff",
                                color: selectedId === doc.id ? "#ffffff" : "#000000",
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
                            onClick={() => handleClick(doc.id)} 
                        >
                            <p className="fw-bold" style={{ fontSize: "18px" }}>{doc.id}. {doc.title}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditList;
