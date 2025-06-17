import React, { useEffect, useState } from "react";
import Button from "../reusable/Button";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { DocumentItem, documentList } from "../../types/docList";
import { RiArrowDropDownLine, RiFileDownloadLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { uploadFile } from "../../utils/upload";
import { OptionType } from "../../types/selectTypes";
import UploadFilterPanel from "../reusable/UploadFilterPanel";
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { apiDeleteBlob, apiPreviewPdf, apiSearchFiles, comfirmUpload } from "../../utils/api/uploadApi";
import { useUser } from "../../hook/useUser";
import { useCompanyStore } from "../../store/companyStore";
import { MdCancel } from "react-icons/md";
import { AuthSchema } from "../../types/schema/auth";
import { ApiMyFactorySchema } from "../../types/schema/api";
import apiMyFactory from "../../utils/api/apiMyFactory";
import { PDFDocument } from "pdf-lib";
import ConfirmUploadModal from "../modal/ConfirmUploadModal";
import { Spinner } from "react-bootstrap";
import CancelUploadModal from "../modal/CancelUploadModal";
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
    const auth = useAuthUser<AuthSchema>();
    const { user } = useUser();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMap>({});
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});
    const { selectedCompany, fetchCompanyById } = useCompanyStore();
    const [warehouseOptions, setWarehouseOptions] = useState<OptionType[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [fileToRemove, setFileToRemove] = useState<{
        docId: number;
        subtitleIndex: number;
        fileIndex: number;
    } | null>(null);
    const [isCancel, setIsCancel] = useState(false);
    const [baseName, setBaseName] = useState<string | null>(null);
    const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
    const [filters, setFilters] = useState<FilterState>({
        warehouse: null, transport: { value: "00", label: "ทางเรือ" }, periodType: null, dateStart: null, dateEnd: null, month: null,
    });
    const [dateTime, setDateTime] = useState<string>("");
    const [mainCode] = useState<string | null>(null);

    useEffect(() => {
        setDateTime(Date.now().toString())
    }, [filters.warehouse, filters.transport, filters.periodType, filters.month, filters.dateStart, filters.dateEnd])

    const getUploadKey = (docId: number, subtitleIndex?: number) =>
        `${docId}-${subtitleIndex ?? 0}`;

    useEffect(() => {
        apiMyFactory(auth!)
            .then(ApiMyFactorySchema.parse)
            .then(({ data }) => data.map((i) => ({
                value: i.factory.slug,
                label: `[${i.factory.slug}] ${i.factory.name}`,
            })))
            .then(setWarehouseOptions)
            .catch(error => {
                toast.error(error.message)
            })
    }, [])

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
            let updatedFilters = { ...prev, ...resetValues, [field]: value };

            const pipeWarehouses = ["H401", "K103"];
            const selectedWarehouse = field === "warehouse" ? value?.value : prev.warehouse?.value;
            if (field === "warehouse" && pipeWarehouses.includes(value?.value)) {
                updatedFilters.transport = { value: "01", label: "ทางท่อ" };
            }

            if (field === "transport" && pipeWarehouses.includes(selectedWarehouse)) {
                if (value?.value === "00") {
                    return prev;
                }
            }

            return updatedFilters;
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
            toast.warning("ไม่มีไฟล์ที่อัปโหลด");
            return;
        }

        const mergedPdf = await PDFDocument.create();
        for (const file of storedFiles) {
            try {
                const previewUrl = await apiPreviewPdf(file.blobPath);
                const ext = file.name.split('.').pop()?.toLowerCase();
                if (ext !== "pdf") {
                    window.open(previewUrl, "_blank");
                    continue;
                }

                const pdfBytes = await fetch(previewUrl).then(res => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            } catch (error) {
                console.error("รวมไฟล์ไม่ได้:", error);
            }
        }

        const mergedPdfBytes = await mergedPdf.save();
        const arrayBuffer = mergedPdfBytes.buffer as ArrayBuffer; // บังคับ Type ให้เป็น ArrayBuffer
        const mergedBlob = new Blob([arrayBuffer], { type: "application/pdf" });
        const mergedBlobUrl = URL.createObjectURL(mergedBlob);
        window.open(mergedBlobUrl, "_blank");
    };

    const openBlobSecurely = async (blobPath: string) => {
        try {
            const previewUrl = await apiPreviewPdf(blobPath);
            const response = await fetch(previewUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            toast.error("ไม่สามารถเปิดเอกสารได้");
            console.error(err);
        }
    };

    const handleDocumentFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        docId: number,
        subtitleIndex?: number
    ) => {
        const key = getUploadKey(docId, subtitleIndex);

        if (
            !event.target.files ||
            !filters.warehouse ||
            !filters.transport ||
            !filters.periodType ||
            (filters.periodType.value === "range" && (!filters.dateStart || !filters.dateEnd)) ||
            (filters.periodType.value === "month" && !filters.month)
        ) {
            toast.warning("กรุณาเลือกคลัง, ทาง, และช่วงยื่นก่อน");
            return;
        }

        const files = Array.from(event.target.files);
        const periodDateStr = getFormattedPeriodDateStr();

        if (!selectedCompany?.name) {
            toast.warning("ยังไม่มีข้อมูลบริษัท กรุณารอสักครู่");
            return;
        }

        setUploadingMap(prev => ({ ...prev, [key]: true }));

        const isTestEmail = user?.email === 'ja.test006+shell@gmail.com' ||
            user?.email === 'ja.test006+or@gmail.com' ||
            user?.email === 'ja.test006+bsrc@gmail.com' ||
            user?.email === 'ja.test006+bangchak@gmail.com';

        const companyName = isTestEmail
            ? `${selectedCompany.name}-test`
            : selectedCompany.name;

        const { uploadedResults, baseNameWithoutDocSeq } = await uploadFile(
            files,
            companyName,
            filters.warehouse.value,
            filters.transport.value,
            periodDateStr,
            docId,
            subtitleIndex,
            mainCode || undefined,
            dateTime
        );

        if (!uploadedResults.length) {
            setUploadingMap(prev => ({ ...prev, [key]: false }));
            event.target.value = "";
            return;
        }

        setBaseName(baseNameWithoutDocSeq);

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

        setUploadingMap(prev => ({ ...prev, [key]: false }));
        event.target.value = "";
    };

    const handleRemoveFile = (docId: number, subtitleIndex: number = 0, fileIndex: number) => {
        setFileToRemove({ docId, subtitleIndex, fileIndex });
        setShowCancelModal(true);
    };

    const handleConfirmRemoveFile = async () => {
        if (!fileToRemove) return;

        const { docId, subtitleIndex, fileIndex } = fileToRemove;
        setIsCancel(true);
        await handleRemoveFileUpload(docId, subtitleIndex, fileIndex);
        setIsCancel(false);
        setShowCancelModal(false);
        setFileToRemove(null);
    };

    const handleRemoveFileUpload = async (
        docId: number,
        subtitleIndex: number = 0,
        fileIndex: number
    ) => {
        const fileToDelete = uploadedFiles[docId]?.[subtitleIndex]?.files?.[fileIndex];
        if (!fileToDelete) return;

        try {
            await apiDeleteBlob(fileToDelete.blobPath);
        } catch (err) {
            console.error("ลบ blob ไม่สำเร็จ:", err);
            toast.error("เกิดข้อผิดพลาดระหว่างลบไฟล์ออกจากระบบ");
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

    const filteredDocuments = documentList.filter((item) => {
        const warehouse = filters.warehouse?.value;
        const transport = filters.transport?.value;

        const transportMatch = !transport || item.transport === transport;
        if (!transportMatch) return false;
        if (warehouse === "H401") {
            const allowedIds = [38, 39, 40, 41, 42, 49, 51];
            return allowedIds.includes(item.id);
        }

        if (warehouse === "K103") {
            const allowedIds = [38, 39, 49];
            return allowedIds.includes(item.id);
        }

        if (item.id === 51) return warehouse === "H401";
        if (item.id === 52) return warehouse === "K103";

        return true;
    }).map((item) => {
        const warehouse = filters.warehouse?.value;
        if (warehouse === "BS11" && item.id === 43) {
            console.log("43");

            return { ...item, title: `${item.title} (ถ้ามี)` };
        }
        return item;
    });

    const isUploadedComplete = (item: DocumentItem): boolean => {
        const subtitle = item.subtitle;

        if (Array.isArray(subtitle) && subtitle.every((text: string): boolean => text.includes("ถ้ามี"))) {
            return true;
        }

        const uploaded = uploadedFiles[item.id];
        if (!uploaded) return false;

        return Object.values(uploaded).some(u => u.files.length > 0);
    };

    const currentDocuments = filteredDocuments.filter((item) => {
        const subtitle = item.subtitle;

        const isSubtitleOptional =
            Array.isArray(subtitle) && subtitle.every((s: string) => s.includes("ถ้ามี"));

        const isTitleOptional = item.title.includes("ถ้ามี");

        return !(isSubtitleOptional || isTitleOptional);
    });

    const isConfirmDisabled = currentDocuments.some(item => !isUploadedComplete(item));

    const handleConfirm = () => {        
        setShowConfirmModal(true);
    };

    const handleConfirmUpload = async () => {
        try {
            setIsConfirming(true);

            if (!selectedCompany?.name) {
                toast.warning("ยังไม่มีข้อมูลบริษัท กรุณารอสักครู่");
                return;
            }
            
            const isTestEmail = user?.email === 'ja.test006+shell@gmail.com' ||
                user?.email === 'ja.test006+or@gmail.com' ||
                user?.email === 'ja.test006+bsrc@gmail.com' ||
                user?.email === 'ja.test006+bangchak@gmail.com';

            const companyName = isTestEmail
                ? `${selectedCompany.name}-test`
                : selectedCompany.name;

            const blobPath = `${companyName}/`;

            await comfirmUpload(blobPath);
            toast.success("อัปโหลดสำเร็จ");

            const response = await apiSearchFiles(companyName, baseName!);
            // console.log("response", response);            
            const folders = response.files.map((file: any) => {
                const parts = file.fileName.split('/');
                parts.pop();
                return parts.join('/');
            });

            localStorage.setItem("folders", JSON.stringify(folders));
            localStorage.setItem("transport", filters.transport?.value || "");
            localStorage.setItem("warehouse", filters.warehouse?.value || "");
            localStorage.setItem("nameWarehouse", filters.warehouse?.label || "");
            localStorage.setItem("periodValue", filters.periodType?.value || "");
            
            navigate("/audit");
            // navigate("/");

        } catch (error) {
            toast.error("เกิดข้อผิดพลาดระหว่างยืนยันการอัปโหลด");
            console.error(error);
        } finally {
            setIsConfirming(false);
            setShowConfirmModal(false);
        }
    };

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <ConfirmUploadModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmUpload}
                isLoading={isConfirming}
            />
            <CancelUploadModal
                show={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setFileToRemove(null);
                }}
                onConfirm={handleConfirmRemoveFile}
                isLoading={isCancel}
            />

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
                        {filteredDocuments.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <tr style={{ borderBottom: openDropdown[item.id] || isAnimating[item.id] ? "none" : "2px solid #0000004B" }}>
                                    <td className="align-middle" style={{ maxWidth: '550px' }}>
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

                                            {index + 1}. {item.title}

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
                                                    accept=".pdf,image/*"
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
                                                    disabled={!!item.subtitle || uploadingMap[getUploadKey(item.id)]}
                                                >
                                                    {uploadingMap[getUploadKey(item.id)] ? (
                                                        <Spinner animation="border" size="sm" className="me-1" />
                                                    ) : (
                                                        <RiFileDownloadLine className="me-1" size={20} />
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                <AnimatePresence>
                                    {openDropdown[item.id] && (
                                        item.subtitle?.map((subtitleText, subIndex) => {
                                            const warehouse = filters.warehouse?.value;
                                            const isSpecialWarehouse = warehouse === "H401" || warehouse === "K103";

                                            if (item.id === 49 && isSpecialWarehouse && subIndex > 1) {
                                                return null;
                                            }

                                            const uploaded = uploadedFiles[item.id]?.[subIndex];
                                            return (
                                                <motion.tr
                                                    key={`${item.id}-subtitle-${subIndex}`}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    style={{
                                                        borderBottom:
                                                            subIndex === (item.subtitle?.length ?? 0) - 1 ? "2px solid #0000004B" : "none",
                                                    }}
                                                >
                                                    <td colSpan={2} className="align-middle td-border" style={{ maxWidth: "280px" }}>
                                                        <span className="fw-bold" style={{ marginLeft: "55px" }}>
                                                            {index + 1}.{subIndex + 1} {subtitleText}
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
                                                                        handleRemoveFile(item.id, subIndex, idx);
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
                                                            onClick={() => mergeAndOpenPdf(item.id, subIndex)}
                                                            disabled={!uploaded?.files?.length}
                                                        />
                                                        <input
                                                            type="file"
                                                            accept=".pdf,image/*"
                                                            multiple
                                                            style={{ display: "none" }}
                                                            id={`file-upload-${item.id}-${subIndex}`}
                                                            onChange={(e) => handleDocumentFileUpload(e, item.id, subIndex)}
                                                        />
                                                        <Button
                                                            className="w-100"
                                                            type="button"
                                                            label="อัปโหลดเอกสาร"
                                                            bgColor="#3D4957"
                                                            color="#FFFFFF"
                                                            maxWidth="200px"
                                                            variant="bg-hide"
                                                            onClick={() =>
                                                                document.getElementById(`file-upload-${item.id}-${subIndex}`)?.click()
                                                            }
                                                            disabled={uploadingMap[getUploadKey(item.id, subIndex)]}
                                                        >
                                                            {uploadingMap[getUploadKey(item.id, subIndex)] && (
                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                            )}
                                                        </Button>
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
                    // disabled={isConfirmDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default UploadPreparation;
