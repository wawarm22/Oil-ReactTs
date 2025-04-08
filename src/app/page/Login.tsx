import React, { useEffect, useState } from "react";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import '../../assets/css/underline-hover.css'
import '../../assets/css/input-highlights.css'
import { MdEmail, MdOutlinePassword } from "react-icons/md";
import bgImage from "../../assets/img/bg-login.png";
import sidebar from "../../assets/img/line-sidebar.png";
import logo from "../../assets/img/excise-logo.png";
import imgForm from "../../assets/img/img-form-login.png"
import topCorner from "../../assets/img/top-corner.png"
import bCorner from "../../assets/img/b-corner.png"
import Button from "../reusable/Button";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../component/LoadingPage";
import { apiLogin } from "../../utils/api/authenApi";
import { ApiLoginResponseSchema } from "../../types/schema/api";
import { useUser } from "../../hook/useUser";
import { cipherEncrypt } from "../../utils/encoding/cipher";

const Login: React.FC = () => {
    const signIn = useSignIn();
    const navigate = useNavigate();
    const { setUser } = useUser();
    const isAuthenticated = useIsAuthenticated();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleRegister = () => {
        navigate('/register');
    }

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiLogin(email, password);

            const parsed = ApiLoginResponseSchema.parse(response);
            console.log("parsed", parsed);

            if (parsed.data.accessToken) {
                const isSignedIn = signIn({
                    auth: {
                        token: parsed.data.accessToken,
                        type: "Bearer",
                    },
                    userState: parsed.data,
                    refresh: parsed.data.refreshToken
                })
                if (!isSignedIn) {
                    throw new Error("Failed to sign in");
                }
                // const { accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn, user } = parsed.data
                const { user } = parsed.data
                // const json_str = JSON.stringify({ accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn })

                // const token = cipherEncrypt(json_str)
                const encryptedUser = cipherEncrypt(JSON.stringify(user));

                // localStorage.setItem("token", token);
                localStorage.setItem("user", encryptedUser);
                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                }

                navigate('/', { replace: true });
            } else {

                setError("Invalid username or password");
            }
        } catch (err) {
            console.log(err);
            setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองอีกครั้ง");
        }

        setIsLoading(false);
    };

    return (
        <>
            {isLoading ? (
                <LoadingPage isLoading={isLoading} />
            ) : (
                <div className="d-flex vh-100 w-100" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
                    <div className="d-flex flex-column align-items-center justify-content-center bg-dark vh-100" style={{ width: "60px" }}>
                        <img src={logo} alt="Logo" className="mb-3" style={{ width: "40px" }} />
                        <img src={sidebar} alt="Sidebar Lines" className="img-fluid" style={{ height: "90%", width: "3px" }} />
                    </div>

                    <div className="container-fluid vh-100">
                        <div className="row h-100">
                            <div className="col-lg-6 col-12 position-relative p-0">
                                <div
                                    className="w-100 h-100"
                                    style={{
                                        background: `url(${bgImage}) center / cover`,
                                    }}
                                ></div>
                                <img
                                    src={topCorner}
                                    alt="Top Corner"
                                    className="position-absolute top-0 end-0 d-none d-lg-block"
                                    style={{ width: '43%', objectFit: 'cover' }}
                                />
                                <div className="position-absolute bottom-0 start-0 w-100">
                                    <img
                                        src={bCorner}
                                        alt="Bottom Corner"
                                        className="w-100"
                                        style={{ objectFit: 'cover', maxWidth: '60%' }}
                                    />
                                    <p className="fw-bold text-white text-start position-absolute translate-middle"
                                        style={{
                                            fontSize: "2vw",
                                            fontFamily: 'IBM Plex Sans Thai',
                                            zIndex: "10",
                                            width: "80%",
                                            top: "59%",
                                            left: "44%",
                                            transform: "translate(-50%, -50%)"
                                        }}
                                    >
                                        <span className="d-block">ระบบขอลดหย่อน</span>
                                        <span className="d-block">และการคืนภาษีน้ำมัน</span>
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center bg-dark"
                                style={{
                                    background: `url(${imgForm}) no-repeat center center / contain`,
                                    backgroundPosition: "top right"
                                }}
                            >
                                <div className="p-4 bg-black text-white d-flex flex-column justify-content-center align-items-center"
                                    style={{
                                        width: "100%",
                                        maxWidth: "550px",
                                        height: "650px",
                                        borderRadius: "195px"
                                    }}
                                >
                                    <div className="position-relative" style={{ width: '300px' }}>
                                        <img
                                            src={logo}
                                            alt="Excise Logo"
                                            className="position-absolute top-0 end-0 m-2 mt-3"
                                            style={{ width: '20%' }}
                                        />
                                        <div>
                                            <p className="fw-bold mb-0" style={{ fontSize: '32px' }}>กรมสรรพสามิต</p>
                                            <p className="mb-5" style={{ fontSize: '16px' }}>THE EXCISE DEPARTMENT</p>
                                        </div>

                                        <form onSubmit={handleLogin}>
                                            {error && <p style={{ color: "red" }}>{error}</p>}
                                            <div className="mb-3 input-group">
                                                <span className="input-group-text bg-white border-0 rounded-start-3">
                                                    <MdEmail size={20} />
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control bg-white border-0 ps-0 rounded-end-3"
                                                    placeholder="อีเมล"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3 input-group">
                                                <span className="input-group-text bg-white border-0 rounded-start-3">
                                                    <MdOutlinePassword size={20} />
                                                </span>
                                                <input
                                                    type="password"
                                                    className="form-control bg-white border-0 ps-0 rounded-end-3"
                                                    placeholder="รหัสผ่าน"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center" style={{ fontFamily: 'Sarabun', fontSize: '16px' }}>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input border-2"
                                                        id="rememberMe"
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderColor: '#ffffff',
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor="rememberMe">จดจำบัญชีผู้ใช้งานนี้</label>
                                                </div>
                                                <a href="/forgot-password" className="text-white text-decoration-none hover-underline">ลืมรหัสผ่าน?</a>
                                            </div>

                                            <div className="d-flex gap-3 mt-5">
                                                <Button
                                                    type="button"
                                                    label="ลงทะเบียน"
                                                    bgColor="#404A57"
                                                    color="#FFF"
                                                    hoverBgColor="#FFFF"
                                                    variant="bg-hide"
                                                    onClick={handleRegister}
                                                />
                                                <Button
                                                    type="submit"
                                                    label="เข้าสู่ระบบ"
                                                    bgColor="#FFCB02"
                                                    color="#000"
                                                    variant="bg-hide"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
