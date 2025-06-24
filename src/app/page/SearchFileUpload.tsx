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
import { apiDeleteBlobAfter, apiPreviewPdfAfterConfirm, apiSearchFiles } from "../../utils/api/uploadApi";
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
import { extractDateCodeFromFileName } from "../../utils/function/parseFileName";
import CustomSelect from "../reusable/CustomSelect";
import { formatDateToThai, formatMonthToBE } from "../../utils/function/format";
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
    dateCode?: string;
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
    const [_baseName, setBaseName] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [fileToRemove, setFileToRemove] = useState<{
        docId: number;
        subtitleIndex: number;
        fileIndex: number;
    } | null>(null);
    const [isCancel, setIsCancel] = useState(false);
    const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
    const [filters, setFilters] = useState<FilterState>({
        warehouse: null, transport: { value: "00", label: "ทางเรือ" }, periodType: null, dateStart: null, dateEnd: null, month: null,
    });
    const [dateCodeFilter, setDateCodeFilter] = useState<OptionType | null>(null);
    const [filteredParsedFiles, setFilteredParsedFiles] = useState<ParsedFileInfo[]>([]);
    const [dateTime, setDateTime] = useState<string>("");
    const getUploadKey = (docId: number, subtitleIndex?: number) =>
        `${docId}-${subtitleIndex ?? 0}`;

    useEffect(() => {
        setDateTime(Date.now().toString())
    }, [filters.warehouse, filters.transport, filters.periodType, filters.month, filters.dateStart, filters.dateEnd])

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

    useEffect(() => {
        if (!dateCodeFilter || !dateCodeFilter.value) {
            setFilteredParsedFiles(parsedFiles); // ถ้าเลือก "ทั้งหมด" ให้โชว์ทุกไฟล์
        } else {
            setFilteredParsedFiles(
                parsedFiles.filter(file => file.mainCode === dateCodeFilter.value)
            );
        }
    }, [parsedFiles, dateCodeFilter]);


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

    const dateCodeOptions: OptionType[] = Array.from(
        new Set(parsedFiles.map(f => f.mainCode).filter(Boolean))
    ).map(code => {
        console.log(code);
        let date: dayjs.Dayjs = dayjs()
        if (code.includes("000000000000")) {
            const dateStr = code.split("-").at(0)! // format "DDMMBB"
            const day = dateStr.slice(0, 2);
            const month = dateStr.slice(2, 4);
            const year = "25" + dateStr.slice(4, 6);
            date = dayjs(`${day}-${month}-${+year - 543}`, "MM-DD-YYYY");
        } else {
            const unixNanoStr = code.split("-").at(1)!
            const unixNano = parseInt(unixNanoStr ?? "1")
            date = dayjs(new Date(unixNano))
        }
        console.log(date);
        return {
            value: code,
            label: date.format("DD MMM BBBB HH:mm")
        }
    }).reverse();

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
                const previewUrl = await apiPreviewPdfAfterConfirm(file.blobPath);
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
        const arrayBuffer = mergedPdfBytes.buffer as ArrayBuffer;
        const mergedBlob = new Blob([arrayBuffer], { type: "application/pdf" });
        const mergedBlobUrl = URL.createObjectURL(mergedBlob);
        window.open(mergedBlobUrl, "_blank");
    };

    const openBlobSecurely = async (blobPath: string) => {
        try {
            const previewUrl = await apiPreviewPdfAfterConfirm(blobPath);
            const response = await fetch(previewUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
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

        const startsWith = companyName ?? "";

        try {
            const result = await apiSearchFiles(startsWith, baseName);

            const parsed: ParsedFileInfo[] = [];
            let localMainCode: string | null = null;

            result.files.forEach((file) => {
                const dateCode = extractDateCodeFromFileName(file.fileName) ?? "";
                const parts = file.fileName.split("/");
                if (parts.length < 4) return;

                const fileNameOnly = parts[parts.length - 1];

                const mainCodeMatch = fileNameOnly.match(/^(\d{6}-\d{12,13})/);

                if (!mainCodeMatch) return;

                localMainCode = mainCodeMatch[1];
                if (!mainCode) {
                    setMainCode(localMainCode);
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
                    mainCode: localMainCode,
                    docCode,
                    fullFileName,
                    docId,
                    subtitleIndex,
                    previewUrl: file.previewUrl,
                    blobPath: file.fileName,
                    dateCode
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
        const isTestEmail = user?.email === 'ja.test006+shell@gmail.com' ||
            user?.email === 'ja.test006+or@gmail.com' ||
            user?.email === 'ja.test006+bsrc@gmail.com' ||
            user?.email === 'ja.test006+bangchak@gmail.com';

        const companyName = isTestEmail
            ? `${selectedCompany.name}-test`
            : selectedCompany.name;

        // const companyName = selectedCompany.name;
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
            setUploadingMap((prev) => ({ ...prev, [key]: false }));
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

        console.log("newParsed", newParsed);

        setParsedFiles(prev => [...prev, ...newParsed]);
        setUploadingMap((prev) => ({ ...prev, [key]: false }));
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
        const fileToDelete = uploadedFiles[docId]?.[subtitleIndex]?.files?.[fileIndex]
            ?? parsedFiles.filter(f => f.docId === docId && f.subtitleIndex === subtitleIndex)[fileIndex];

        if (!fileToDelete) return;

        try {
            await apiDeleteBlobAfter(fileToDelete.blobPath);
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

            if (!filters.warehouse || !filters.transport || !filters.periodType) {
                return;
            }

            if (!selectedCompany?.name) {
                toast.warning("ยังไม่มีข้อมูลบริษัท กรุณารอสักครู่");
                return;
            }

            const periodDateStr = getFormattedPeriodDateStr();
            const baseName = buildBaseName(
                filters.warehouse.value,
                filters.transport.value,
                periodDateStr
            );

            const isTestEmail = user?.email === 'ja.test006+shell@gmail.com' ||
                user?.email === 'ja.test006+or@gmail.com' ||
                user?.email === 'ja.test006+bsrc@gmail.com' ||
                user?.email === 'ja.test006+bangchak@gmail.com';

            let companyName = isTestEmail
                ? `${selectedCompany.name}-test`
                : selectedCompany.name;

            const selectedDateCode = dateCodeFilter?.value;
            if (selectedDateCode && selectedDateCode !== "") {
                companyName = `${companyName}/${selectedDateCode}`;
            }

            const month = formatMonthToBE(filters.month);
            const dateStart = formatDateToThai(filters.dateStart);
            const dateEnd = formatDateToThai(filters.dateEnd);

            const response = await apiSearchFiles(companyName, baseName);

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
            localStorage.setItem("month", month || "");
            localStorage.setItem("dateStart", dateStart || "");
            localStorage.setItem("dateEnd", dateEnd || "");
            navigate("/audit?from=search-file");
            // navigate("/");

        } catch (error) {
            toast.error("เกิดข้อผิดพลาดระหว่างยืนยันการอัปโหลด");
            console.error(error);
        } finally {
            setIsConfirming(false);
            setShowConfirmModal(false);
        }
    };

    const getFilesWithDisplayName = (docId: number, subtitleIndex: number = 0): { displayName: string, file: ParsedFileInfo }[] => {
        const group = filteredParsedFiles.filter(f => f.docId === docId && f.subtitleIndex === subtitleIndex);
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
                            <th className="align-middle text-center" style={{ fontSize: '22px' }}></th>
                            <th className="text-end">
                                <CustomSelect
                                    label="วันที่อัปโหลด"
                                    value={dateCodeFilter}
                                    onChange={setDateCodeFilter}
                                    options={[
                                        { value: "", label: "เลือกวันที่ทั้งหมด" },
                                        ...dateCodeOptions
                                    ]}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.map((item, index) => (
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
                                                        marginTop: "2px"
                                                    }}
                                                />
                                                <div style={{ whiteSpace: "normal", wordBreak: "break-word", paddingTop: "1px" }}>
                                                    <span className="fw-bold" style={{ cursor: "pointer" }}>
                                                        {index + 1}. {item.title}
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
                                                        <RiFileDownloadLine className="me-1" size={25} />
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                <AnimatePresence>
                                    {openDropdown[item.id] && (
                                        item.subtitle?.map((subtitleText, subIndex) => {
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
                                                    <td colSpan={2} className="align-middle td-border">
                                                        <div className="fw-bold" style={{ marginLeft: "55px" }}>
                                                            {index + 1}.{subIndex + 1} {subtitleText}
                                                        </div>

                                                        <div className="mt-2 ms-5">
                                                            {getFilesWithDisplayName(item.id, subIndex).map(({ displayName, file }, idx) => (
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
                                                                            handleRemoveFile(item.id, subIndex, idx);
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
                                                            onClick={() => mergeAndOpenPdf(item.id, subIndex)}
                                                            disabled={!hasParsedFiles(item.id, subIndex)}
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
                                                            maxWidth="200px"
                                                            variant="bg-hide"
                                                            onClick={() => document.getElementById(`file-upload-${item.id}-${subIndex}`)?.click()}
                                                            disabled={uploadingMap[getUploadKey(item.id, subIndex)]}
                                                        >
                                                            {uploadingMap[getUploadKey(item.id, subIndex)] && (
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
