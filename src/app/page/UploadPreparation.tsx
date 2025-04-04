import React, { useEffect, useState } from "react";
import Button from "../reusable/Button";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate } from "react-router-dom";
import { DocumentItem, documentList } from "../../types/docList";
import { RiArrowDropDownLine, RiFileDownloadLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { uploadFile } from "../../utils/upload";
import { OptionType } from "../../types/selectTypes";
import UploadFilterPanel from "../reusable/UploadFilterPanel";
import oilFactories from "../../assets/json/oil-factory.json";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { apiDeleteBlob, apiPreviewPdf, comfirmUpload } from "../../utils/api/uploadApi";
import { useUser } from "../../hook/useUser";
import { useCompanyStore } from "../../store/companyStore";
import { MdCancel } from "react-icons/md";
import { PDFDocument } from "pdf-lib";
dayjs.extend(buddhistEra);

type UploadedFileMap = {
    [docId: number]: {
        [subtitleIndex: number]: {
            files: {
                name: string;
                data: string;
                blobPath: string;
            }[];
        };
    };
};

type FilterState = {
    warehouse: OptionType | null;
    transport: OptionType | null;
    periodType: OptionType | null;
    dateStart: Date | null;
    dateEnd: Date | null;
    month: Date | null;
};

const UploadPreparation: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMap>({});
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});
    const { selectedCompany, fetchCompanyById } = useCompanyStore();
    const [filters, setFilters] = useState<FilterState>({
        warehouse: null, transport: null, periodType: null, dateStart: null, dateEnd: null, month: null,
    });

    useEffect(() => {
        if (user?.company_id) {
            fetchCompanyById(user.company_id);
        }
    }, [user?.company_id, fetchCompanyById]);

    const getFormattedPeriodDateStr = () => {
        if (!filters.periodType) return "";

        if (filters.periodType.value === "month" && filters.month) {
            const month = dayjs(filters.month).format("MM");
            const buddhistYear = dayjs(filters.month).format("BB").slice(-2);
            return `0000${month}${buddhistYear}`;
        }

        if (filters.periodType.value === "range" && filters.dateStart && filters.dateEnd) {
            const startDay = dayjs(filters.dateStart).format("DD");
            const endDay = dayjs(filters.dateEnd).format("DD");
            const month = dayjs(filters.dateStart).format("MM");
            const buddhistYear = dayjs(filters.dateStart).format("BB").slice(-2);
            return `${startDay}${endDay}${month}${buddhistYear}`;
        }

        return "";
    };

    const currentCompany = selectedCompany?.name;
    const warehouseOptions: OptionType[] = oilFactories
        .filter(fac => fac.company_name === currentCompany)
        .map(fac => ({
            value: fac.factories_id,
            label: fac.factories_name
        }));

    const transportOptions: OptionType[] = [
        { value: "00", label: "ทางเรือ" },
        { value: "01", label: "ทางท่อ" },
    ];

    const periodOptions: OptionType[] = [
        { value: "range", label: "ช่วงวันที่" },
        { value: "month", label: "เดือน" },
    ];

    const handleFilterChange = (field: keyof typeof filters, value: any) => {
        const resetMap: { [key in keyof typeof filters]?: (keyof typeof filters)[] } = {
            periodType: ["dateStart", "dateEnd", "month"],
        };

        setFilters(prev => {
            const resetFields = resetMap[field] || [];
            const resetValues = Object.fromEntries(resetFields.map(k => [k, null]));
            return { ...prev, ...resetValues, [field]: value };
        });
    };

    const toggleDropdown = (docId: number) => {
        setOpenDropdown(prev => ({ ...prev, [docId]: !prev[docId] }));
        if (openDropdown[docId]) {
            setIsAnimating(prev => ({ ...prev, [docId]: true }));
            setTimeout(() => setIsAnimating(prev => ({ ...prev, [docId]: false })), 300);
        }
    };

    const mergeAndOpenPdf = async (docId: number, subtitleIndex: number = 0) => {
        const storedFiles = uploadedFiles[docId]?.[subtitleIndex]?.files;
        if (!storedFiles || storedFiles.length === 0) {
            alert("ไม่มีไฟล์ที่อัปโหลด");
            return;
        }
    
        const mergedPdf = await PDFDocument.create();
        for (const file of storedFiles) {
            try {
                const previewUrl = await apiPreviewPdf(file.blobPath);
                const pdfBytes = await fetch(previewUrl).then(res => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            } catch (error) {
                console.error("รวมไฟล์ไม่ได้:", error);
            }
        }
    
        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlobUrl = URL.createObjectURL(new Blob([mergedPdfBytes], { type: "application/pdf" }));
        window.open(mergedBlobUrl, "_blank");
    };    

    const openBlobSecurely = async (blobPath: string) => {
        try {
            const previewUrl = await apiPreviewPdf(blobPath);
            const response = await fetch(previewUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            window.open(url, "_blank");
        } catch (err) {
            alert("ไม่สามารถเปิดเอกสารได้");
            console.error(err);
        }
    };

    const handleDocumentFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        docId: number,
        subtitleIndex?: number
    ) => {
        if (
            !event.target.files ||
            !filters.warehouse ||
            !filters.transport ||
            !filters.periodType ||
            (filters.periodType.value === "range" && (!filters.dateStart || !filters.dateEnd)) ||
            (filters.periodType.value === "month" && !filters.month)
        ) {
            alert("กรุณาเลือกคลัง, ทาง, และช่วงยื่นก่อนอัปโหลด");
            return;
        }

        const files = Array.from(event.target.files);
        const periodDateStr = getFormattedPeriodDateStr();
        if (!selectedCompany?.name) {
            alert("ยังไม่มีข้อมูลบริษัท กรุณารอสักครู่");
            return;
        }

        const companyName = selectedCompany.name;

        const uploadedResults = await uploadFile(
            files,
            companyName,
            filters.warehouse.value,
            filters.transport.value,
            periodDateStr,
            docId,
            subtitleIndex
        );

        if (!uploadedResults.length) return;

        setUploadedFiles((prev) => {
            const existingDoc = prev[docId] || {};
            const existingFiles = existingDoc[subtitleIndex ?? 0]?.files || [];

            return {
                ...prev,
                [docId]: {
                    ...existingDoc,
                    [subtitleIndex ?? 0]: {
                        files: [...existingFiles, ...uploadedResults],
                    },
                },
            };
        });
    };

    const handleRemoveFile = async (
        docId: number,
        subtitleIndex: number = 0,
        fileIndex: number
    ) => {
        const fileToDelete = uploadedFiles[docId]?.[subtitleIndex]?.files?.[fileIndex];
        if (!fileToDelete) return;

        try {
            await apiDeleteBlob(fileToDelete.blobPath);
            console.log("ลบ blob สำเร็จ:");
        } catch (err) {
            console.error("ลบ blob ไม่สำเร็จ:", err);
            alert("เกิดข้อผิดพลาดระหว่างลบไฟล์ออกจากระบบ");
            return;
        }

        setUploadedFiles((prevState) => {
            const files = prevState[docId]?.[subtitleIndex]?.files ?? [];
            const updatedFiles = files.filter((_, idx) => idx !== fileIndex);

            return {
                ...prevState,
                [docId]: {
                    ...prevState[docId],
                    [subtitleIndex]: {
                        ...prevState[docId]?.[subtitleIndex],
                        files: updatedFiles,
                    },
                },
            };
        });
    };

    const isUploadedComplete = (item: DocumentItem): boolean => {
        const uploaded = uploadedFiles[item.id];
        if (!uploaded) return false;

        if (item.subtitle?.length) {
            return Object.values(uploaded).some(u => u.files.length > 0);
        }

        return uploaded[0]?.files.length > 0;
    };

    const currentDocuments = documentList.filter(
        (item) =>
            !item.title.includes("ถ้ามี") &&
            (!filters.transport || item.transport === filters.transport.value)
    );

    const isConfirmDisabled = currentDocuments.some(item => !isUploadedComplete(item));

    const handleConfirm = async () => {
        try {
            if (isConfirmDisabled) {
                alert("กรุณาอัปโหลดเอกสารให้ครบก่อนยืนยัน");
                return;
            }

            const blobPath = `${currentCompany}/`;
            const result = await comfirmUpload(blobPath);
            console.log("อัปโหลดเสร็จแล้ว:", result);

            navigate("/confirm");
        } catch (error) {
            alert("เกิดข้อผิดพลาดระหว่างยืนยันการอัปโหลด");
            console.error(error);
        }
    };

    const filteredDocuments = documentList.filter(
        (item) => !filters.transport || item.transport === filters.transport.value
    );

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                อัปโหลดเอกสาร
            </p>
            <div className="d-flex bg-white p-4 rounded shadow-sm justify-content-center align-items-start mb-3">
                <UploadFilterPanel
                    filters={filters}
                    onChange={handleFilterChange}
                    options={{
                        warehouse: warehouseOptions,
                        transport: transportOptions,
                        period: periodOptions,
                    }}
                />
            </div>
            <div className="table-responsive bg-white p-4 rounded shadow-sm rounded-3" style={{ fontSize: '16spx' }}>
                <table className="table custom-table table-borderless fw-bold">
                    <thead style={{ borderBottom: "2px solid #0000004B" }}>
                        <tr>
                            <th className="align-middle" style={{ fontSize: '22px' }}>รายการเอกสาร</th>
                            <th className="align-middle text-center" style={{ fontSize: '22px' }}>
                            </th>
                            <th className="text-end">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr style={{ borderBottom: openDropdown[item.id] || isAnimating[item.id] ? "none" : "2px solid #0000004B" }}>
                                    <td className="align-middle" style={{ maxWidth: '600px' }}>
                                        <span
                                            className="fw-bold"
                                            style={{ cursor: "pointer", verticalAlign: "middle" }}
                                            onClick={() => item.subtitle && toggleDropdown(item.id)}
                                        >
                                            <span
                                                className="me-2 m-0"
                                                style={{
                                                    display: "inline-block",
                                                    width: "3px",
                                                    height: "28px",
                                                    backgroundColor: "#9D9D9D",
                                                    borderRadius: "2px",
                                                    verticalAlign: "middle"
                                                }}
                                            ></span>

                                            {item.title}

                                            {!item.subtitle && uploadedFiles[item.id]?.[0]?.files?.length > 0 && (
                                                <span className="ms-2">
                                                    {uploadedFiles[item.id][0].files.map((file, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-primary fw-bold ms-2 me-2 d-inline-flex align-items-center"
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <span onClick={(e) => {
                                                                e.stopPropagation();
                                                                openBlobSecurely(file.blobPath);
                                                            }}>
                                                                {file.name}
                                                            </span>
                                                            <MdCancel
                                                                size={16}
                                                                className="ms-1 text-danger"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveFile(item.id, 0, idx);
                                                                }}
                                                                title="ลบไฟล์"
                                                            />
                                                        </span>
                                                    ))}
                                                </span>
                                            )}
                                        </span>

                                        {item.subtitle && (
                                            <CSSTransition
                                                in={openDropdown[item.id]}
                                                timeout={300}
                                                classNames="rotate-icon"
                                            >
                                                <RiArrowDropDownLine
                                                    size={25}
                                                    className={`dropdown-icon ${openDropdown[item.id] ? "rotated" : ""}`}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleDropdown(item.id)}
                                                />
                                            </CSSTransition>
                                        )}
                                    </td>
                                    <td className="text-center align-middle">
                                    </td>
                                    <td className="text-end">
                                        {!item.subtitle && (
                                            <>
                                                <Button
                                                    className="w-100"
                                                    type="button"
                                                    label="ดูเอกสาร"
                                                    bgColor="#3D4957"
                                                    color="#FFFFFF"
                                                    maxWidth="150px"
                                                    variant="bg-hide"
                                                    onClick={() => mergeAndOpenPdf(item.id)}
                                                    disabled={openDropdown[item.id] || !uploadedFiles[item.id]?.[0]?.files?.length}
                                                />
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    multiple
                                                    style={{ display: "none" }}
                                                    id={`file-upload-${item.id}`}
                                                    onChange={(e) => handleDocumentFileUpload(e, item.id)}
                                                />
                                                <Button
                                                    className="ms-3 w-100"
                                                    type="button"
                                                    label="อัปโหลดเอกสาร"
                                                    bgColor="#3D4957"
                                                    color="#FFFFFF"
                                                    maxWidth="260px"
                                                    variant="bg-hide"
                                                    onClick={() => document.getElementById(`file-upload-${item.id}`)?.click()}
                                                    disabled={!!item.subtitle}
                                                >
                                                    <RiFileDownloadLine className="me-1" size={25} />
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                <AnimatePresence>
                                    {openDropdown[item.id] && (
                                        item.subtitle?.map((subtitleText, index) => {
                                            const uploaded = uploadedFiles[item.id]?.[index];
                                            return (
                                                <motion.tr
                                                    key={`${item.id}-subtitle-${index}`}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    style={{
                                                        borderBottom:
                                                            index === (item.subtitle?.length ?? 0) - 1 ? "2px solid #0000004B" : "none",
                                                    }}
                                                >
                                                    <td colSpan={2} className="align-middle td-border">
                                                        <span className="fw-bold" style={{ marginLeft: "55px" }}>
                                                            {subtitleText}
                                                        </span>
                                                        {uploaded?.files?.map((file, idx) => (
                                                            <>
                                                                <span
                                                                    key={idx}
                                                                    className="text-primary fw-bold ms-3"
                                                                    style={{ cursor: "pointer", display: "inline-block" }}
                                                                    onClick={() => openBlobSecurely(file.blobPath)}
                                                                >
                                                                    {file.name}
                                                                </span>
                                                                <MdCancel
                                                                    size={16}
                                                                    className="ms-1 text-danger"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveFile(item.id, index, idx);
                                                                    }}
                                                                    title="ลบไฟล์"
                                                                />
                                                            </>
                                                        ))}
                                                    </td>

                                                    <td className="text-end td-border-r">
                                                        <Button
                                                            className="w-100 me-2"
                                                            type="button"
                                                            label="ดูเอกสาร"
                                                            bgColor="#3D4957"
                                                            color="#FFFFFF"
                                                            maxWidth="150px"
                                                            variant="bg-hide"
                                                            onClick={() => mergeAndOpenPdf(item.id, index)}
                                                            disabled={!uploaded?.files?.length}
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="application/pdf"
                                                            multiple
                                                            style={{ display: "none" }}
                                                            id={`file-upload-${item.id}-${index}`}
                                                            onChange={(e) => handleDocumentFileUpload(e, item.id, index)}
                                                        />
                                                        <Button
                                                            className="w-100"
                                                            type="button"
                                                            label="อัปโหลดเอกสาร"
                                                            bgColor="#3D4957"
                                                            maxWidth="200px"
                                                            variant="bg-hide"
                                                            onClick={() => document.getElementById(`file-upload-${item.id}-${index}`)?.click()}
                                                        />
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        className="me-3"
                        type="button"
                        label="ย้อนกลับ"
                        onClick={() => navigate("/")}
                        bgColor="#717171"
                        variant="bg-hide"
                    />
                    <Button
                        type="button"
                        label="ยืนยันการอัปโหลด"
                        onClick={handleConfirm}
                        bgColor="#FFCB02"
                        color="#1E2329"
                        variant="bg-hide"
                        disabled={isConfirmDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default UploadPreparation;
