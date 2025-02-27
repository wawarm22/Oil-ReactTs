import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../reusable/Button"; 
import { documentList } from "../../types/docList";

interface DocumentClassificationModalProps {
    show: boolean;
    onClose: () => void;
}

const DocumentClassificationModal: React.FC<DocumentClassificationModalProps> = ({ show, onClose }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Body className="p-5 pb-3" style={{ fontFamily: 'Sarabun' }}>
                <ul className="list-unstyled">
                    {documentList.map((document) => (
                        <li key={document.id} className="d-flex justify-content-between align-items-center py-2 border-bottom border-3">
                            <span className="fw-bold" style={{ fontSize: "18px" }}>
                                {document.id}. {document.title}
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
