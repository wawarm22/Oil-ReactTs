import React, { useState, useEffect } from "react";
import { getPdfThumbnail } from "../../utils/function/pdfUtils";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";

const UploadMultiple: React.FC = () => {
    const [files, setFiles] = useState<{ name: string; url: string; thumbnail: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [currentStatus, _setCurrentStatus] = useState<StepStatus>(StepStatus.UPLOAD);

    useEffect(() => {
        const fetchThumbnails = async () => {
            const storedFiles = localStorage.getItem("uploadedFiles");
            if (storedFiles) {
                const parsedFiles = JSON.parse(storedFiles);
                const filesWithThumbnails = await Promise.all(
                    parsedFiles.map(async (file: { name: string; url: string }) => ({
                        ...file,
                        thumbnail: await getPdfThumbnail(file.url) // ✅ ดึงรูปตัวอย่าง PDF
                    }))
                );

                setFiles(filesWithThumbnails);
                setSelectedFile(filesWithThumbnails.length > 0 ? filesWithThumbnails[0].url : null);
            }
        };

        fetchThumbnails();
    }, []);

    return (
        <div className="container-fluid mt-4 w-100" style={{ maxWidth: "1800px" }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                รายการลดหย่อนเเละการคืนภาษี
            </p>
            <StepProgress status={currentStatus} />
            
            <p className="fw-bold">รายการเอกสารที่อัปโหลดล่าสุด</p>

            <div className="d-flex bg-light rounded">
                {/* แสดงรายการไฟล์ที่อัปโหลด */}
                <div className="d-flex flex-wrap" style={{ flex: 2 }}>
                    {files.map((file, index) => (
                        <div key={index} className="p-2 text-center" style={{ width: "18%" }}>
                            <img src={file.thumbnail} alt="PDF" style={{ width: "100px", height: "120px" }} />
                            <p className="mt-2">{file.name}</p>
                            <input
                                type="checkbox"
                                onChange={() => setSelectedFile(file.url)}
                                checked={selectedFile === file.url}
                            />
                        </div>
                    ))}
                </div>

                {/* แสดง Preview PDF */}
                <div className="p-4 d-flex justify-content-center bg-light rounded" style={{ maxWidth: "700px",flex: 3 }}>
                    {selectedFile ? (
                        <iframe
                            src={selectedFile}
                            width="80%"
                            height="600px"
                            title="PDF Preview"
                        />
                    ) : (
                        <p>เลือกไฟล์เพื่อแสดงตัวอย่าง</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadMultiple;
