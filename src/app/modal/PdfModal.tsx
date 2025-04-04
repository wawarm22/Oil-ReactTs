import React from "react";
import { Modal, Button } from "react-bootstrap";

interface PdfModalProps {
    show: boolean;
    onClose: () => void;
    urls: string[];
}

const PdfModal: React.FC<PdfModalProps> = ({ show, onClose, urls }) => {
    return (
        <Modal show={show} onHide={onClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>แสดงเอกสาร PDF</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
                {urls.map((url, index) => (
                    <iframe
                        key={index}
                        src={url}
                        title={`PDF-${index}`}
                        width="100%"
                        height="800px"
                        style={{ border: "1px solid #ccc", marginBottom: "20px", borderRadius: "4px" }}
                    />
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    ปิด
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PdfModal;
