import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../reusable/Button"; // ✅ ใช้ Button ที่มีอยู่แล้ว

interface DocumentClassificationModalProps {
    show: boolean;
    onClose: () => void;
}

const documentCategories = [
    "การตรวจตารางเปรียบเทียบอัตราส่วนและสูตรการผลิตน้ำมัน",
    "การตรวจบัญชีซื้อขายแบบ ภส. 07-01 ภส. 07-02 และ ภส. 03-07",
    "ตรวจแบบ ภส. 07-01 ภส. 07-02 และ ภส. 07-04",
    "ตรวจการทำบัญชีสิทธิ",
    "การตรวจการชำระภาษีของบริษัทว่าชำระภาษีถูกต้องหรือไม่"
];

const DocumentClassificationModal: React.FC<DocumentClassificationModalProps> = ({ show, onClose }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Body className="p-5 pb-3">
                <ul className="list-unstyled">
                    {documentCategories.map((category, index) => (
                        <li key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <span className="fw-bold" style={{ fontSize: "18px" }}>
                                {index + 1}. {category}
                            </span>
                            <Button
                                type="button"
                                label="เพิ่มเอกสาร"
                                bgColor="#000"
                                color="#FFF"
                                hoverBgColor="#FFF"
                                hoverBorderColor="#000"
                                hoverColor="#000"
                                maxWidth="135px"
                                variant="bg-hide"
                            />
                        </li>
                    ))}
                </ul>
                <div className="d-flex justify-content-center mt-3">
                    <Button
                        type="button"
                        label="ย้อนกลับ"
                        bgColor="#717171"
                        color="#FFF"
                        hoverBgColor="#FFFF"
                        hoverBorderColor="#717171"
                        hoverColor="#717171"
                        maxWidth="150px"
                        variant="bg-hide"
                        onClick={onClose}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DocumentClassificationModal;
