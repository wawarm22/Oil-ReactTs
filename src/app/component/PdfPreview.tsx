import React, { useEffect } from "react";

interface Props {
    imageSrc: string | null;
    currentPage: number;
    ocrFields: Record<string, any> | null;
}

const PdfPreview: React.FC<Props> = ({ imageSrc, currentPage }) => {
    useEffect(() => {
        // const PdfPreview = await 
        // if (localFolders) {
           
        // }
    }, []);

    return (
        <div className="shadow-sm rounded-2 p-3 d-flex justify-content-center align-items-center"
            style={{ width: "45%", background: "#E0E0E0", borderRadius: "8px" }}
        >
            {imageSrc && (
                <img src={imageSrc} alt={`PDF Page ${currentPage}`} className="w-100 h-100" style={{ objectFit: "contain", borderRadius: "6px" }} />
            )}
        </div>
    );
};

export default PdfPreview;
