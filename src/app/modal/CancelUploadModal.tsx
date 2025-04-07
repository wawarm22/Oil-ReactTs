import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import Button from "../reusable/Button";

type CancelUploadModalProps = {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
};

const CancelUploadModal: React.FC<CancelUploadModalProps> = ({
    show,
    onClose,
    onConfirm,
    isLoading,
}) => {
    return (
        <Modal className="d-flex justify-content-center" show={show} onHide={onClose} centered>
            <Modal.Body>
                <p style={{ fontSize: '24px' }}>
                    คุณต้องการยืนยันการลบเอกสารหรือไม่ ?
                </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button
                    type="button"
                    label="ยกเลิก"
                    onClick={onClose}
                    bgColor="#717171"
                    variant="bg-hide"
                    disabled={isLoading}
                />
                <Button
                    type="button"
                    label={isLoading ? "กำลังลบเอกสาร..." : "ยืนยันการลบเอกสาร"}
                    onClick={onConfirm}
                    bgColor="#FFCB02"
                    color="#1E2329"
                    className="ms-2"
                    maxWidth="200px"
                    variant="bg-hide"
                    disabled={isLoading}
                >
                    {isLoading && (
                        <Spinner
                            animation="border"
                            role="status"
                            size="sm"
                            className="me-2"
                        >
                            <span className="visually-hidden">กำลังลบเอกสาร...</span>
                        </Spinner>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelUploadModal;
