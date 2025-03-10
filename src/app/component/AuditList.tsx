import React from 'react';
import { documentList } from "../../types/docList";
import MotionCard from '../reusable/MotionCard';

interface AuditListProps {
    selectedId: number | null;
    setSelectedId: (id: number | null) => void;
}

const AuditList: React.FC<AuditListProps> = ({ selectedId, setSelectedId }) => {    

    return (
        <div className="container-fluid d-flex justify-content-center shadow-sm py-4 bg-white rounded-2 w-100 mt-3" style={{ fontFamily: 'Sarabun' }}>
            <div className="d-flex flex-column align-items-start" style={{ maxWidth: '1800px' }}>
                <p className="fw-bold text-start ms-2" style={{ fontSize: "26px", fontFamily: "IBM Plex Sans Thai" }}>
                    รายการตรวจสอบเอกสาร
                </p>
                <div className="d-flex flex-wrap justify-content-center">
                    {documentList.map((doc) => (
                        <MotionCard
                            key={doc.id}
                            isSelected={selectedId === doc.id}
                            onClick={() => setSelectedId(doc.id)}
                            margin="mx-2 py-2 px-3" 
                        >
                            {doc.id}. {doc.title}
                        </MotionCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditList;
