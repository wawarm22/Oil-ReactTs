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
import { getDocSequenceNumber, uploadFile } from "../../utils/upload";
import { OptionType } from "../../types/selectTypes";
import { toast } from 'react-toastify';
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

type ParsedFileInfo = {
    mainCode: string;
    docCode: string;
    fullFileName: string;
    docId: number;
    subtitleIndex: number;
    previewUrl: string;
    blobPath: string;
};

const SearchFileUpload: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuthUser<AuthSchema>();
    const { user } = useUser();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMap>({});
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});
    const { selectedCompany, fetchCompanyById } = useCompanyStore();
    const [warehouseOptions, setWarehouseOptions] = useState<OptionType[]>([]);
    const [parsedFiles, setParsedFiles] = useState<ParsedFileInfo[]>([]);
    const [mainCode, setMainCode] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
    const [filters, setFilters] = useState<FilterState>({
        warehouse: null, transport: null, periodType: null, dateStart: null, dateEnd: null, month: null,
    });

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

    const currentCompany = selectedCompany?.name;

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
        const storedFiles = parsedFiles.filter(f => f.docId === docId && f.subtitleIndex === subtitleIndex);
        if (!storedFiles.length) {
            toast.warning("ไม่มีไฟล์ที่อัปโหลด");
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
            toast.error("ไม่สามารถเปิดเอกสารได้");
            console.error(err);
        }
    };

    const buildBaseName = (
        warehouseCode: string,
        transportCode: string,
        periodDateStr: string
    ): string => {
        return `${warehouseCode}-${transportCode}-${periodDateStr}`;
    };

    const handleSearchClick = async () => {
        if (!filters.warehouse || !filters.transport || !filters.periodType) {
            toast.warning("กรุณาเลือกคลัง, ทาง, และช่วงยื่นก่อน");
            return;
        }

        const periodDateStr = getFormattedPeriodDateStr();
        const baseName = buildBaseName(
            filters.warehouse.value,
            filters.transport.value,
            periodDateStr
        );

        const startsWith = selectedCompany?.name ?? "";

        try {
            const result = await apiSearchFiles(startsWith, baseName);
            const parsed: ParsedFileInfo[] = [];
            let mainCode: string | null = null;

            result.files.forEach((file) => {
                const parts = file.fileName.split("/");
                if (parts.length < 4) return;

                const fileNameOnly = parts[parts.length - 1];

                const mainCodeMatch = fileNameOnly.match(/^(\d{6}-\d{12})/);
                if (!mainCodeMatch) return;

                if (!mainCode) {
                    mainCode = mainCodeMatch[1];
                    setMainCode(mainCode);
                }

                const docCodeMatch = parts[1].match(/DOC\d{4}/);
                if (!docCodeMatch) return;
                const docCode = docCodeMatch[0];

                const fullFileName = fileNameOnly;

                const docIdStr = parts[2];
                const docId = parseInt(docIdStr);
                if (isNaN(docId)) return;

                let subtitleIndex = 0;
                if (parts.length === 5) {
                    subtitleIndex = parseInt(parts[3]) - 1;
                }

                parsed.push({
                    mainCode,
                    docCode,
                    fullFileName,
                    docId,
                    subtitleIndex,
                    previewUrl: file.previewUrl,
                    blobPath: file.fileName,
                });
            });

            setParsedFiles(parsed);

            const tempUploaded: UploadedFileMap = {};
            parsed.forEach((file) => {
                const { docId, subtitleIndex, fullFileName, previewUrl, blobPath } = file;
                if (!tempUploaded[docId]) tempUploaded[docId] = {};
                if (!tempUploaded[docId][subtitleIndex]) tempUploaded[docId][subtitleIndex] = { files: [] };

                tempUploaded[docId][subtitleIndex].files.push({
                    name: fullFileName,
                    data: previewUrl,
                    blobPath,
                });
            });
            setUploadedFiles(tempUploaded);

        } catch (err) {
            console.error("ค้นหาไฟล์ไม่สำเร็จ:", err);
            toast.error("ค้นหาไม่สำเร็จ");
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
            toast.warning("กรุณาเลือกคลัง, ทาง, และช่วงยื่นก่อนอัปโหลด");
            return;
        }

        const files = Array.from(event.target.files);
        const periodDateStr = getFormattedPeriodDateStr();
        if (!selectedCompany?.name) {
            toast.warning("ยังไม่มีข้อมูลบริษัท กรุณารอสักครู่");
            return;
        }

        setUploadingMap((prev) => ({ ...prev, [key]: true }));
        const companyName = selectedCompany.name;

        const uploadedResults = await uploadFile(
            files,
            companyName,
            filters.warehouse.value,
            filters.transport.value,
            periodDateStr,
            docId,
            subtitleIndex,
            mainCode || undefined
        );

        if (!uploadedResults.length) {
            setUploadingMap((prev) => ({ ...prev, [key]: false }));
            return;
        }

        // ✅ 1. เพิ่มลงใน uploadedFiles (ไฟล์ใช้จริง)
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

        const newParsed = uploadedResults.map((file, _i) => {
            const docCode = getDocSequenceNumber(docId, subtitleIndex);
            return {
                mainCode: mainCode || "",
                docCode,
                fullFileName: file.name,
                docId,
                subtitleIndex: subtitleIndex ?? 0,
                previewUrl: file.data,
                blobPath: file.blobPath,
            };
        });

        setParsedFiles(prev => [...prev, ...newParsed]);
        setUploadingMap((prev) => ({ ...prev, [key]: false }));
    };

    const handleRemoveFile = async (
        docId: number,
        subtitleIndex: number = 0,
        fileIndex: number
    ) => {
        const fileToDelete = uploadedFiles[docId]?.[subtitleIndex]?.files?.[fileIndex]
            ?? parsedFiles.filter(f => f.docId === docId && f.subtitleIndex === subtitleIndex)[fileIndex];

        if (!fileToDelete) return;

        try {
            await apiDeleteBlob(fileToDelete.blobPath);
            console.log("ลบ blob สำเร็จ:", fileToDelete.blobPath);
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

        setParsedFiles((prev) =>
            prev.filter((_, idx, arr) =>
                !(arr[idx].docId === docId && arr[idx].subtitleIndex === subtitleIndex &&
                    arr.filter(f => f.docId === docId && f.subtitleIndex === subtitleIndex).indexOf(arr[idx]) === fileIndex)
            )
        );
    };


    const hasParsedFiles = (docId: number, subtitleIndex: number = 0): boolean => {
        return parsedFiles.some(f => f.docId === docId && f.subtitleIndex === subtitleIndex);
    };

    const isUploadedComplete = (item: DocumentItem): boolean => {
        const uploaded = uploadedFiles[item.id];
        if (!uploaded) return false;

        if (item.subtitle?.length) {
            return item.subtitle.some((_, idx) => uploaded[idx]?.files?.length > 0);
        }

        return uploaded[0]?.files?.length > 0;
    };

    const currentDocuments = documentList.filter(
        (item) =>
            !item.title.includes("ถ้ามี") &&
            (!filters.transport || item.transport === filters.transport.value)
    );

    const isConfirmDisabled = currentDocuments.some(item => !isUploadedComplete(item));

    const handleConfirm = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmUpload = async () => {
        try {
            setIsConfirming(true);
            const blobPath = `${currentCompany}/`;
            const result = await comfirmUpload(blobPath);
            console.log("อัปโหลดเสร็จแล้ว:", result);
            toast.success("อัปโหลดเสร็จแล้ว");

            setShowConfirmModal(false);
            navigate("/");
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดระหว่างยืนยันการอัปโหลด");
            console.error(error);
        } finally {
            setIsConfirming(false);
        }
    };

    const getFilesWithDisplayName = (docId: number, subtitleIndex: number = 0): { displayName: string, file: ParsedFileInfo }[] => {
        const group = parsedFiles.filter(f => f.docId === docId && f.subtitleIndex === subtitleIndex);
        return group.map((file, idx) => {
            const baseName = subtitleIndex === 0
                ? documentList.find(d => d.id === docId)?.title ?? "ชื่อเอกสาร"
                : documentList.find(d => d.id === docId)?.subtitle?.[subtitleIndex] ?? "หัวข้อย่อย";
            return {
                displayName: `${baseName}-${idx + 1}`,
                file
            };
        });
    };

    const filteredDocuments = documentList.filter(
        (item) => !filters.transport || item.transport === filters.transport.value
    );

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <ConfirmUploadModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmUpload}
                isLoading={isConfirming}
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
                <Button
                    className="w-100"
                    type="button"
                    label="ค้นหา"
                    bgColor="#3D4957"
                    color="#FFFFFF"
                    maxWidth="150px"
                    variant="bg-hide"
                    onClick={handleSearchClick}
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
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-start" style={{ gap: '8px' }}>
                                                <div
                                                    style={{
                                                        width: "3px",
                                                        backgroundColor: "#9D9D9D",
                                                        borderRadius: "2px",
                                                        minHeight: "28px",
                                                        marginTop: "2px" // ปรับตำแหน่งให้สูงขึ้น
                                                    }}
                                                />
                                                <div style={{ whiteSpace: "normal", wordBreak: "break-word", paddingTop: "1px" }}>
                                                    <span className="fw-bold" style={{ cursor: "pointer" }}>
                                                        {item.title}
                                                    </span>
                                                </div>
                                            </div>

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
                                        </div>

                                        {/* แสดงไฟล์ในบรรทัดใหม่ */}
                                        {!item.subtitle && (
                                            <div style={{ marginLeft: '11px' }}>
                                                {getFilesWithDisplayName(item.id, 0).map(({ displayName, file }, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-primary fw-bold d-inline-flex align-items-center me-3"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <div
                                                            className="text-primary fw-bold mt-1"
                                                            style={{
                                                                display: "inline",
                                                                wordBreak: "break-word",
                                                                whiteSpace: "normal"
                                                            }}
                                                        >
                                                            <span
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openBlobSecurely(file.blobPath);
                                                                }}
                                                                style={{ display: "inline" }}
                                                            >
                                                                {displayName}
                                                            </span>
                                                            <MdCancel
                                                                size={16}
                                                                className="text-danger ms-1"
                                                                style={{ cursor: "pointer", verticalAlign: "middle", display: "inline" }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveFile(item.id, 0, idx);
                                                                }}
                                                                title="ลบไฟล์"
                                                            />
                                                        </div>
                                                    </span>
                                                ))}
                                            </div>
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
                                                    disabled={openDropdown[item.id] || !hasParsedFiles(item.id, 0)}
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
                                                    disabled={!!item.subtitle || uploadingMap[getUploadKey(item.id)]}
                                                >
                                                    {uploadingMap[getUploadKey(item.id)] ? (
                                                        <Spinner animation="border" size="sm" className="me-1" />
                                                    ) : (
                                                        <RiFileDownloadLine className="me-1" size={25} />
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                <AnimatePresence>
                                    {openDropdown[item.id] && (
                                        item.subtitle?.map((subtitleText, index) => {
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
                                                        <div className="fw-bold" style={{ marginLeft: "55px" }}>
                                                            {subtitleText}
                                                        </div>

                                                        <div className="mt-2 ms-5">
                                                            {getFilesWithDisplayName(item.id, index).map(({ displayName, file }, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="text-primary fw-bold d-inline-flex align-items-center mx-2"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <span onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openBlobSecurely(file.blobPath);
                                                                    }}>
                                                                        {displayName}
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
                                                                </span>
                                                            ))}
                                                        </div>
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
                                                            disabled={!hasParsedFiles(item.id, index)}
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
                                                            disabled={uploadingMap[getUploadKey(item.id, index)]}
                                                        >
                                                            {uploadingMap[getUploadKey(item.id, index)] && (
                                                                <Spinner animation="border" size="sm" className="me-1" />
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
                        disabled={isConfirmDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchFileUpload;
