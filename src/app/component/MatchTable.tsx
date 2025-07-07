import { TableData } from "../../types/tableTypes";
import { readableNumber } from "../../utils/function/format";

interface MatchTableProps {
  data: TableData[];
}

const MatchTable: React.FC<MatchTableProps> = ({ data }) => {
  const materials = ["น้ำมันพื้นฐาน", "เอทานอล", "สารเติมแต่ง"];

  return (
    <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
      <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>
        ตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน
      </p>
      <table className="table table-bordered border-dark align-middle text-center" style={{ fontSize: '13.5px' }}>
        <thead className="align-middle">
          <tr >
            <th className= "align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8" }}>ลำดับ</th>
            <th className= "align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8" }}>ชื่อผลิตภัณฑ์</th>
            <th colSpan={2} style={{ backgroundColor: "#E8E8E8" }}>รายการวัตถุดิบหรือส่วนประกอบที่ใช้ในการผลิต</th>
            <th className= "align-bottom" rowSpan={2} style={{ minWidth: "160px", backgroundColor: "#E8E8E8" }}>ปริมาณและจำนวน (ลิตร)</th>
            <th className= "align-bottom" rowSpan={2} style={{ minWidth: "160px", backgroundColor: "#E8E8E8" }}>สินค้าต่อ 1 หน่วย</th>
            <th className= "align-bottom" rowSpan={2} style={{ minWidth: "160px", backgroundColor: "#E8E8E8" }}>สูตรการผลิต</th>
            <th className= "align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8" }}>เลขที่หนังสืออนุมัติ</th>
            {/* <th rowSpan={2}>เลขที่หนังสืออนุมัติ</th> */}
          </tr>
          <tr>
            <th style={{ minWidth: "160px", backgroundColor: "#E8E8E8" }}>ประเภทวัตถุดิบ</th>
            <th style={{ minWidth: "160px", backgroundColor: "#E8E8E8" }}>ชื่อวัตถุดิบ</th>
          </tr>
        </thead>
        <tbody>
          {data.flatMap((table, tableIdx) => {
            if (!table.items || table.items.length === 0) {
              return [
                <tr key={`empty-${tableIdx}`}>
                  <td>{tableIdx + 1}</td>
                  <td className="fw-bold text-start">{table.productName}</td>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <td key={i}>-</td>
                  ))}
                </tr>
              ];
            }

            let typeFallbackIdx = 0;
            const sumQuantity = table.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const sumRatio = table.items.reduce((sum, item) => sum + (item.ratio || 0), 0);

            return Array.from({ length: table.items.length + 1 }).map((_, i) => {
              if (i < table.items.length) {
                const item = table.items[i];
                // ตรวจสอบ item.type ว่างหรือไม่
                let typeToShow = item.type;
                if (!typeToShow || typeToShow === "-") {
                  // ถ้ายังเหลือใน array materials ค่อยวน
                  typeToShow = materials[typeFallbackIdx] ?? "-";
                  typeFallbackIdx++;
                }
                return (
                  <tr key={`${tableIdx}-${i}`}>
                    {i === 0 && (
                      <>
                        <td rowSpan={table.items.length + 1}>{tableIdx + 1}</td>
                        <td rowSpan={table.items.length + 1} className="fw-bold text-start">
                          {table.productName}
                        </td>
                      </>
                    )}
                    <td className="text-start">{typeToShow}</td>
                    <td className="text-start">{item.name}</td>
                    <td className="text-end">
                      {typeof item.quantity === "number"
                        ? readableNumber(item.quantity, 2)
                        : "-"}
                    </td>
                    <td className="text-end">{item.ratio ? readableNumber(item.ratio, 6) : '-'}</td>
                    <td className="text-end">{item.productionFormula ?? '-'}</td>
                    <td className="text-start">{item.remark || '-'}</td>
                    {/* <td className="text-center">{item.approvalNumber || '-'}</td> */}
                  </tr>
                );
              } else {
                return (
                  <tr key={`sumrow-${tableIdx}`}>
                    <td colSpan={2} className="text-center fw-bold" style={{ backgroundColor: "#E8E8E8" }}>ปริมาณรวม</td>
                    <td className="text-end">{sumQuantity ? readableNumber(sumQuantity, 2) : '-'}</td>
                    <td className="text-end">{sumRatio ? Math.round(sumRatio).toFixed(6) : '-'}</td>
                    <td colSpan={2}></td>
                  </tr>
                );
              }
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;
