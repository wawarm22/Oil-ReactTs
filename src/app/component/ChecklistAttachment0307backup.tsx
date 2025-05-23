// import React, { useEffect, useMemo, useState } from "react";
// import { OcrAttachment0307Document } from "../../types/ocrFileType";
// import { cleanCellValue, renderLabel } from "../../utils/function/ocrUtils";
// import { getPrepared0307 } from "../../utils/api/validateApi";
// import { useCompanyStore } from "../../store/companyStore";
// import useAuthUser from "react-auth-kit/hooks/useAuthUser";
// import { AuthSchema } from "../../types/schema/auth";

// interface Props {
//     data: OcrAttachment0307Document;
// }

// const ChecklistAttachment0307: React.FC<Props> = ({ data }) => {
//     const auth = useAuthUser<AuthSchema>();
//     const { selectedCompany } = useCompanyStore();
//     const factoriesNumber = localStorage.getItem("warehouse") ?? null;
//     const [preparedData, setPreparedData] = useState<OcrAttachment0307Document | null>(null);
//     const [validationResult, setValidationResult] = useState<any>(null);

//     useEffect(() => {
//         if (data.id && auth) {
//             getPrepared0307(data.id, auth).then((res) => {
//                 if (res && res.data) {
//                     console.log("res.data", res.data);
                    
//                     setPreparedData(res.data);
//                 } else {
//                     setPreparedData(null);
//                 }
//             });
//         }
//     }, [data.id, auth]);

//     const tables = data.detail_table ?? [];
//     if (tables.length < 3) return <p className="text-muted">ไม่พบข้อมูลตาราง</p>;

//     const normalRowLabels = [
//         "วันที่",
//         "เนื้อน้ำมัน",
//         "ไบโอดีเชล",
//         "สารเติมแต่ง",
//         "ปริมาณรวมสารเติมแต่ง",
//         "อัตราภาษีสรรสามิต",
//         "อัตราภาษีหักลดหย่อน",
//         "ภาษีสรรพสามิต",
//         "ค่าลดหย่อน มาตรา 105",
//         "นำส่ง",
//         "ขอคืน",
//     ];

//     const normalRows: typeof tables = [];
//     const summaryRows: typeof tables = [];

//     let foundSummary = false;
//     for (const row of tables.slice(3)) {
//         const col1 = cleanCellValue(row.properties?.column_1?.value ?? "");
//         if (!foundSummary && col1.includes("รวม")) {
//             foundSummary = true;
//         }

//         if (foundSummary) {
//             summaryRows.push(row);
//         } else {
//             normalRows.push(row);
//         }
//     }

//     return (
//         <div className="d-flex flex-column gap-2">
//             <div>
//                 {renderLabel("เอกสาร")}
//                 <div className="border rounded-2 shadow-sm bg-white p-2">{cleanCellValue(data.header)}</div>
//             </div>
//             <div>
//                 {renderLabel("วันที่")}
//                 <div className="border rounded-2 shadow-sm bg-white p-2">{cleanCellValue(data.date)}</div>
//             </div>
//             <div>
//                 {renderLabel("น้ำมัน")}
//                 <div className="border rounded-2 shadow-sm bg-white p-2">{cleanCellValue(data.oil)}</div>
//             </div>

//             {normalRows.map((row, idx) => (
//                 <div key={`row-${idx}`} className="border-top pt-2">
//                     {normalRowLabels.map((label, colIdx) => {
//                         let colKey = `column_${colIdx + 1}`;
//                         const value = cleanCellValue(row.properties?.[colKey]?.value);
//                         if (!value) return null;
//                         return (
//                             <div key={`${idx}-${colKey}`} className="mb-1">
//                                 {renderLabel(label)}
//                                 <div className="border rounded-2 shadow-sm bg-white p-2">{value}</div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ))}

//             {summaryRows.length > 0 && (
//                 <>
//                     <div className="fw-bold fs-5 text-primary border-top pt-3">รวม</div>
//                     {summaryRows.map((row, sIdx) => (
//                         <div key={`summary-${sIdx}`} className="pt-2">
//                             {Object.entries(row.properties || {}).map(([colKey, colVal]) => {
//                                 if (!colVal?.value || colVal.value === "-") return null;
//                                 if (colKey === "column_1") return null;
//                                 return (
//                                     <div key={`summary-${sIdx}-${colKey}`} className="mb-1">
//                                         {renderLabel(colVal.value)}
//                                         <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{colVal.value}</div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ))}
//                 </>
//             )}
//             <hr className="border-top border-2 border-secondary my-1" />
//             <div className="m-0">
//                 {renderLabel("ลงชื่อ ผู้ประกอบอุตสาหกรรม")}
//                 <div className="border rounded-2 shadow-sm bg-white p-2">
//                     {cleanCellValue(data.name)}
//                 </div>
//             </div>
//             <div>
//                 {renderLabel("ตำแหน่ง")}
//                 <div className="border rounded-2 shadow-sm bg-white p-2">
//                     {cleanCellValue(data.position)}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChecklistAttachment0307;
