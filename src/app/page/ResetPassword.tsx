import { useState } from "react";
import Button from "../reusable/Button";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <form className="shadow p-5 rounded-2">
                <h2 className="text-center text-dark mb-4">รีเซ็ตรหัสผ่าน</h2>
                <div className="d-flex justify-content-center">
                    <input
                        type="password"
                        placeholder="รหัสผ่านใหม่"
                        className="w-100 p-3 border rounded-2 mb-3"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <input
                        type="password"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        className="w-100 p-3 border rounded-2 mb-4"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <Button
                        type="submit"
                        label="ยืนยัน"
                        bgColor="#FFCB02"
                        color="#000"
                        maxWidth="150px"
                        variant="bg-hide"
                    />
                </div>
            </form>
        </div>
    );
}

export default ResetPassword;