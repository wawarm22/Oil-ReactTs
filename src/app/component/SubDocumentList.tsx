import React, { useState, useEffect } from "react";
import { documentList } from "../../types/docList";

interface SubDocumentListProps {
    selectedId: number | null;
    setSelectedDocIndex: (index: number | null) => void; 
}

const SubDocumentList: React.FC<SubDocumentListProps> = ({ selectedId, setSelectedDocIndex }) => {
    const selectedCategory = documentList.find(doc => doc.id === selectedId);
    const [_selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);

    useEffect(() => {
        if (selectedCategory && selectedCategory.title!.length > 0) {
            setSelectedSubIndex(0);
            setSelectedDocIndex(0); 
        }
    }, [selectedId]);

    // const handleSubClick = (index: number) => {
    //     setSelectedSubIndex(index);
    //     setSelectedDocIndex(index); 
    // };

    return (
        <div className="container-fluid d-flex justify-content-start align-items-start shadow-sm bg-white rounded-2 m-0 mt-3" style={{ padding: "25px 35px", maxWidth: "1020px" }}>
            <div className="d-flex flex-column align-items-start w-100">
                <p className="fw-bold text-start ms-2 mb-0" style={{ fontSize: "26px", fontFamily: "IBM Plex Sans Thai" }}>
                    รายการเอกสารที่ใช้
                </p>

                {selectedCategory && (
                    <div className="d-flex flex-wrap justify-content-start">                            
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubDocumentList;
