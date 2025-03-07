import React, { useState, useEffect } from "react";
import { getPdfThumbnail } from "../../utils/function/pdfUtils";
import StepProgress from "../reusable/StepProgress";
import { StepStatus } from "../../types/enum/stepStatus";
import Button from "../reusable/Button";
import { RiFileDownloadLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Pagination from "../reusable/Pagination";
import "../../assets/css/checkbox.css";
import DocumentClassificationModal from "../modal/DocumentClassificationModal";

const UploadMultiple: React.FC = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<{ name: string; url: string; thumbnail: string }[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<{ url: string; index: number }[]>([]);
    const [currentStatus, _setCurrentStatus] = useState<StepStatus>(StepStatus.UPLOAD);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchThumbnails = async () => {
            const storedFiles = localStorage.getItem("uploadedFiles");
            if (storedFiles) {
                const parsedFiles = JSON.parse(storedFiles);
                const filesWithThumbnails = await Promise.all(
                    parsedFiles.map(async (file: { name: string; url: string }) => ({
                        ...file,
                        thumbnail: await getPdfThumbnail(file.url),
                    }))
                );
                console.log(filesWithThumbnails);
                
                setFiles(filesWithThumbnails);
            }
        };

        fetchThumbnails();
    }, []);

    const handleUploadMoreFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const newFiles = Array.from(event.target.files);
        const newFilesWithThumbnails = await Promise.all(
            newFiles.map(async (file) => ({
                name: file.name,
                url: URL.createObjectURL(file),
                thumbnail: await getPdfThumbnail(URL.createObjectURL(file)),
            }))
        );

        const updatedFiles = [...files, ...newFilesWithThumbnails];
        setFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    };

    const handleSelectFile = (fileUrl: string) => {
        setSelectedFiles(prevSelected => {
            const isSelected = prevSelected.some(file => file.url === fileUrl);
            if (isSelected) {
                return prevSelected.filter(file => file.url !== fileUrl);
            }
            return [...prevSelected, { url: fileUrl, index: prevSelected.length + 1 }];
        });
    };

    const handleBack = () => {
        navigate('/upload');
    };

    return (
        <div className="container-fluid mt-4 w-100" style={{ maxWidth: "1800px" }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>
                รายการลดหย่อนเเละการคืนภาษี
            </p>
            <StepProgress status={currentStatus} />

            <div className="row mt-3">
                <DocumentClassificationModal show={showModal} onClose={() => setShowModal(false)} />
                <div className="col-md-7">
                    <div className="card shadow-sm p-3 h-100" style={{ height: '800px' }}>
                        <p className="fw-bold text-start" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "28px" }}>
                            รายการเอกสารที่อัปโหลดล่าสุด
                        </p>
                        <div className="d-flex flex-wrap justify-content-start mb-3">
                            {files.map((file, index) => {
                                const selectedIndex = selectedFiles.findIndex(f => f.url === file.url);
                                return (
                                    <div key={index} className="p-2 d-flex flex-column align-items-center text-center position-relative" style={{ width: "20%", maxHeight: "210px" }}>
                                        <img src={file.thumbnail} alt="PDF" className="img-fluid border border-dark mb-2" style={{ width: "100px", height: "120px" }} />

                                        <p className="small text-truncate mb-1"
                                            style={{ width: "140px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minHeight: "25px", lineHeight: "25px" }}>
                                            {file.name}
                                        </p>

                                        <div className="position-absolute top-0 start-0 text-dark fw-bold rounded-circle" style={{
                                            width: "20px",
                                            height: "20px",
                                            fontSize: "12px",
                                            backgroundColor: "#FFCB02",
                                            display: selectedIndex !== -1 ? "flex" : "none",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "8px"
                                        }}>
                                            {selectedIndex + 1}
                                        </div>

                                        <input
                                            type="checkbox"
                                            className="form-check-input mt-1 border border-dark"
                                            onChange={() => handleSelectFile(file.url)}
                                            checked={selectedIndex !== -1}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="d-flex justify-content-center mt-auto gap-2">
                            <Button type="button" label="ย้อนกลับ" bgColor="#717171" color="#FFF" hoverBgColor="#FFFF" hoverBorderColor="#717171" hoverColor="#717171" variant="bg-hide" onClick={handleBack} />

                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                style={{ display: "none" }}
                                id="file-upload-more"
                                onChange={handleUploadMoreFiles}
                            />
                            <Button
                                type="button"
                                label="อัปโหลดเอกสารเพิ่มเติม"
                                bgColor="#1E2329"
                                color="#FFF"
                                maxWidth="260px"
                                hoverBgColor="#FFFF"
                                hoverBorderColor="#1E2329"
                                hoverColor="#1E2329"
                                variant="bg-hide"
                                onClick={() => document.getElementById("file-upload-more")?.click()}
                            >
                                <RiFileDownloadLine className="me-1" size={25} />
                            </Button>

                            <Button
                                type="button"
                                label="จำแนกเอกสาร"
                                bgColor="#FFCB02"
                                color="#1E2329"
                                hoverBgColor="#FFFF"
                                hoverColor="#FFCB02"
                                hoverBorderColor="#FFCB02"
                                variant="bg-hide"
                                onClick={() => setShowModal(true)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center" style={{ height: "100%", backgroundColor: '#CECECE' }}>
                        {selectedFiles.length > 0 ? (
                            <>
                                <iframe
                                    src={selectedFiles[currentPage - 1].url}
                                    width="100%"
                                    height="770px"
                                    title="PDF Preview"
                                    className="rounded"
                                />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={selectedFiles.length}
                                    onPageChange={setCurrentPage}
                                    numberColor="#FFFF"
                                />
                            </>
                        ) : (
                            <p className="text-muted">เลือกไฟล์เพื่อแสดงตัวอย่าง</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadMultiple;
