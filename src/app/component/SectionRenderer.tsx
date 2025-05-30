import React from "react";
import { getBorderColor } from "../../utils/function/getBorderColor";
import { numberOrText } from "../../utils/function/numberOrText";

type SectionType = {
    title: string;
    type: string;
    columns: { key: string; label: string }[];
};

interface Props {
    section: SectionType;
    rows: any[];
    validationRows?: any[];
}

const SectionRenderer: React.FC<Props> = ({ section, rows, validationRows }) => {
    if (!rows || rows.length === 0) return null;
    return (
        <div className="mb-2">
            <hr className="border-2 border-secondary m-0" />
            <div className="fw-bold mb-1">{section.title}</div>
            {rows.map((row, idx) => (
                <div key={idx} className="mb-2">
                    {section.columns.map(col => {
                        const validationObj = validationRows && validationRows[idx]
                            ? col.key === "transfer"
                                ? undefined
                                : col.key.includes('.')
                                    ? col.key.split('.').reduce((acc, key) => acc?.[key], validationRows[idx])
                                    : validationRows[idx][col.key]
                            : undefined;

                        if (col.key === "transfer") {
                            if (!row.transfer || row.transfer.length === 0) return null;
                            return row.transfer.map((t: any, tIdx: number) => {
                                const tValidation =
                                    validationRows && validationRows[idx]?.transfer
                                        ? validationRows[idx].transfer[tIdx]
                                        : undefined;
                                return (
                                    <React.Fragment key={tIdx}>
                                        <div className="fw-bold mt-1">โอนคลัง</div>
                                        <div className="mb-1">
                                            <div className="fw-bold">คลังปลายทาง</div>
                                            <div style={{
                                                fontSize: "14px",
                                                height: "39px",
                                                border: getBorderColor(tValidation?.destinationDepot),
                                                borderRadius: "0.375rem",
                                                boxShadow: "0 .5rem 1rem rgba(33,37,41,.03)",
                                                background: "#fff",
                                                padding: "0.5rem 1rem"
                                            }}>
                                                {t.destinationDepot || ""}
                                            </div>
                                        </div>
                                        <div className="mb-1">
                                            <div className="fw-bold">ปริมาณ</div>
                                            <div style={{
                                                fontSize: "14px",
                                                border: getBorderColor(tValidation?.quantity),
                                                borderRadius: "0.375rem",
                                                boxShadow: "0 .5rem 1rem rgba(33,37,41,.03)",
                                                background: "#fff",
                                                padding: "0.5rem 1rem"
                                            }}>
                                                {numberOrText(t.quantity)}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="fw-bold">เลขที่ใบกำกับภาษี</div>
                                            <div style={{
                                                fontSize: "14px",
                                                height: "39px",
                                                border: getBorderColor(tValidation?.invoiceNo),
                                                borderRadius: "0.375rem",
                                                boxShadow: "0 .5rem 1rem rgba(33,37,41,.03)",
                                                background: "#fff",
                                                padding: "0.5rem 1rem"
                                            }}>
                                                {t.invoiceNo || ""}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            });
                        }

                        // dot notation
                        const val = col.key.split('.').reduce((acc, cur) => acc?.[cur], row);
                        if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) return null;

                        return (
                            <div key={col.key}>
                                <div className="fw-bold">{col.label}</div>
                                <div style={{
                                    fontSize: "14px",
                                    border: getBorderColor(validationObj),
                                    borderRadius: "0.375rem",
                                    boxShadow: "0 .5rem 1rem rgba(33,37,41,.03)",
                                    background: "#fff",
                                    padding: "0.5rem 1rem"
                                }}>
                                    {numberOrText(val)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default SectionRenderer;
