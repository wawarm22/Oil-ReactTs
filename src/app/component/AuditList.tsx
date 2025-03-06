import React from 'react';
import { documentList } from "../../types/docList";

const AuditList: React.FC = () => {
    return (
        <div className="container-fluid d-flex justify-content-center shadow-sm py-4 bg-white rounded-2 w-100 mt-3" style={{ fontFamily: 'Sarabun' }}>
            <div className="d-flex flex-column align-items-start" style={{ maxWidth: '1800px' }}>
                <p className="fw-bold text-start ms-2" style={{ fontSize: "26px" }}>
                    รายการตรวจสอบเอกสาร
                </p>
                <div className="d-flex flex-wrap justify-content-center">
                    {documentList.map((doc) => (
                        <div
                            key={doc.id}
                            className="d-flex flex-column justify-content-start align-items-start border border-dark border-2 rounded-2 mx-2 py-2 px-3"
                            style={{ width: '325px', height: '135px' }}
                        >
                            <p className="fw-bold" style={{ fontSize: "18px" }}>{doc.id}. {doc.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditList;
