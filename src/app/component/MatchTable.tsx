import { TableData } from "../../types/tableTypes";

interface MatchTableProps {
  data: TableData[];
}

const MatchTable: React.FC<MatchTableProps> = ({ data }) => {
  return (
    <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
      <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>
        ตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน
      </p>
      <table className="table table-bordered border-dark align-middle text-center">
        <thead>
          <tr>
            <th rowSpan={2}>ลำดับ</th>
            <th rowSpan={2}>ชื่อผลิตภัณฑ์</th>
            <th colSpan={2}>รายการวัตถุดิบหรือส่วนประกอบที่ใช้ในการผลิต</th>
            <th rowSpan={2}>ปริมาณและจำนวน (ลิตร)</th>
            <th rowSpan={2}>สินค้าต่อ 1 หน่วย</th>
            <th rowSpan={2} style={{ width: "170px" }}>สูตรการผลิต</th>
            <th rowSpan={2}>เลขที่หนังสืออนุมัติ</th>
            <th rowSpan={2}>หมายเหตุ</th>
          </tr>
          <tr>
            <th>ประเภทวัตถุดิบ</th>
            <th>ชื่อวัตถุดิบ</th>
          </tr>
        </thead>
        <tbody>
          {data.flatMap((table, tableIdx) =>
            !table.items || table.items.length === 0
              ? [
                <tr key={`empty-${tableIdx}`}>
                  <td>{tableIdx + 1}</td>
                  <td className="fw-bold">{table.productName}</td>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <td key={i}>-</td>
                  ))}
                </tr>
              ]
              : table.items.map((item, itemIdx) => (
                <tr key={`${tableIdx}-${itemIdx}`}>
                  {itemIdx === 0 && (
                    <>
                      <td rowSpan={table.items.length}>{tableIdx + 1}</td>
                      <td rowSpan={table.items.length} className="fw-bold">
                        {table.productName}
                      </td>
                    </>
                  )}
                  <td className="text-center">{item.type || '-'}</td>
                  <td className="text-center">{item.name}</td>
                  <td className="text-end">
                    {item.quantity?.toLocaleString?.() ?? '-'}
                  </td>
                  <td className="text-end">{item.ratio ?? '-'}</td>
                  <td className="text-end">{item.productionFormula ?? '-'}</td>
                  <td className="text-center">{item.approvalNumber || '-'}</td>
                  <td className="text-center">{item.remark || '-'}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;
