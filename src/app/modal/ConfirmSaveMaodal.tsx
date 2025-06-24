import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import Button from "../reusable/Button";

type ConfirmSaveMaodalProps = {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
};

const ConfirmSaveMaodal: React.FC<ConfirmSaveMaodalProps> = ({
    show,
    onClose,
    onConfirm,
    isLoading,
}) => {
    return (
        <Modal className="d-flex justify-content-center" show={show} onHide={onClose} centered>
            {/* <Modal.Header closeButton>
                <Modal.Title>ยืนยันการอัปโหลด</Modal.Title>
            </Modal.Header> */}
            <Modal.Body>
                <p className="fw-bold m-0" style={{ fontSize: '23px', fontFamily: 'IBM Plex Sans Thai' }}>
                    คุณต้องการยืนยันการอัปโหลดเอกสารหรือไม่ ?
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
                    label={isLoading ? "กำลังอัปโหลด..." : "ยืนยันอัปโหลด"}
                    onClick={onConfirm}
                    bgColor="#FFCB02"
                    color="#1E2329"
                    className="ms-2"
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
                            <span className="visually-hidden">กำลังโหลด...</span>
                        </Spinner>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmSaveMaodal;
