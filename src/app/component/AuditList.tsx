import React from 'react';
import MotionCard from '../reusable/MotionCard';

interface AuditListProps {
    selectedId: number | null;
    setSelectedId: (id: number | null) => void;
    documentList: { id: number; title: string; subtitle?: string[] }[];
    selectedDocIndex: number | null;
    setSelectedDocIndex: (index: number | null) => void;
    currentStep: number;
}

const AuditList: React.FC<AuditListProps> = ({ selectedId, setSelectedId, documentList, selectedDocIndex, setSelectedDocIndex, currentStep }) => {
    return (
        <div className="container-fluid d-flex justify-content-start shadow-sm py-3 bg-white rounded-2 w-100" style={{ fontFamily: 'Sarabun' }}>
            <div className="d-flex flex-column align-items-start" style={{ maxWidth: '1800px' }}>
                <p className="fw-bold text-start ms-2" style={{ fontSize: "26px", fontFamily: "IBM Plex Sans Thai" }}>
                    รายการตรวจสอบเอกสาร
                </p>
                <div className="d-flex flex-wrap justify-content-start">
                    {documentList.map((doc) => {
                        const showTitle = !(currentStep === 1 && doc.id === 3);
                        const subtitlesToShow = doc.subtitle?.slice(0, 2) || [];

                        return (
                            <div key={doc.id} className="m-0">
                                {showTitle && (
                                    <MotionCard
                                        isSelected={selectedId === doc.id}
                                        onClick={() => {
                                            setSelectedId(doc.id);
                                            setSelectedDocIndex(doc.id); // ✅ กำหนดค่า index หรือ id ที่ต้องการ
                                        }}
                                        margin="mx-2 py-2 px-3 mb-2"
                                    >
                                        {doc.title}
                                    </MotionCard>
                                )}

                                {subtitlesToShow.length > 0 && (
                                    <div className="d-flex flex-wrap">
                                        {subtitlesToShow.map((sub, idx) => (
                                            <MotionCard
                                                key={`${doc.id}-${idx}`}
                                                isSelected={selectedId === doc.id && selectedDocIndex === idx}
                                                onClick={() => {
                                                    setSelectedId(doc.id);
                                                    setSelectedDocIndex(idx);
                                                }}
                                                container="mx-2 px-3 py-2 shadow-sm rounded-2"
                                                style={{
                                                    border: "1px solid #dee2e6",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                {sub}
                                            </MotionCard>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AuditList;
