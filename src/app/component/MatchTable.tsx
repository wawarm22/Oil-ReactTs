import { TableData } from "../../types/tableTypes";

interface MatchTableProps {
  data: TableData[]; // เปลี่ยนจาก TableData → TableData[]
}

const MatchTable: React.FC<MatchTableProps> = ({ data }) => {
  return (
    <>
      {data.map((table, idx) => (
        <div
          key={idx}
          className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3"
        >
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
              <tr>
                <td rowSpan={table.items.length + 1}>1</td>
                <td rowSpan={table.items.length + 1} className="fw-bold">
                  {table.productName}
                </td>
              </tr>
              {table.items.map((item, index) => (
                <tr key={index}>
                  <td className="text-start">{item.name}</td>
                  <td className="text-center">{item.type || '-'}</td>
                  <td className="text-end">{item.quantity.toLocaleString()}</td>
                  <td className="text-end">{item.ratio ?? '-'}</td>
                  <td className="text-end">{item.productionFormula}</td>
                  <td className="text-center">{item.approvalNumber || '-'}</td>
                  <td className="text-start">{item.remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export default MatchTable;
