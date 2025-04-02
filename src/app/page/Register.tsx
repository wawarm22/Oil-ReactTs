import React, { useEffect, useState } from "react";
import '../../assets/css/input-highlights.css'
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select, { MultiValue } from "react-select";
import bgRegister from "../../assets/img/bg-regis.png";
import lineTop from "../../assets/img/line-top.png";
import Button from "../reusable/Button";
import frameImage from "../../assets/img/boeder-right.png";
import borderLeft from "../../assets/img/border-left.png";
import { RegisterFormValues, registerSchema } from "../schemas/registerSchema";
import { selectFactory, selectLocation } from "../../assets/style/selectLocation";
import { useLocationStore } from "../../store/locationStore";
import { apiRegister } from "../../utils/api/authenApi";
import { UserData } from "../../types/userTypes";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useCompanyStore } from "../../store/companyStore";
import { FactoryOption } from "../../types/selectTypes";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { apiCompanyById } from "../../utils/api/companyDataApi";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            province: "",
            district: "",
            subdistrict: ""
        }
    });
    const { provinces, selectedDistricts: districts, selectedSubDistricts: subDistricts, fetchLocations, filterDistricts, filterSubDistricts } = useLocationStore();
    const { companies, fetchCompanies } = useCompanyStore();
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [factoryOptions, setFactoryOptions] = useState<{ value: number; label: string }[]>([]);
    const [selectedFactoryId, setSelectedFactoryId] = useState<FactoryOption[]>([]);
    const [passwordValidation, setPasswordValidation] = useState({
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        isValidLength: false
    });

    useEffect(() => {
        fetchCompanies();
        fetchLocations();
    }, [fetchLocations, fetchCompanies]);

    const handleTaxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setValue("tax_registration", input);

        const matchedCompany = companies.find(company => company.excise_id === input);
        if (matchedCompany) {
            setValue("company_name", matchedCompany.name);

            try {
                const companyDetail = await apiCompanyById(matchedCompany.id);
                const options = companyDetail.factories.map(factory => ({
                    value: factory.id,
                    label: factory.name
                }));
                setFactoryOptions(options);
                setSelectedFactoryId([]);
            } catch (err) {
                console.error("Error loading company detail:", err);
            }
        } else {
            setValue("company_name", "");
            setFactoryOptions([]);
            setSelectedFactoryId([]);
        }
    };

    const handleProvinceChange = (selectedProvince: any) => {
        if (selectedProvince?.value) {
            setValue("province", selectedProvince.value.toString());
            filterDistricts(selectedProvince.value);
        }
    };

    const handleDistrictChange = (selectedDistrict: any) => {
        if (selectedDistrict?.value) {
            setValue("district", selectedDistrict.value.toString());
            filterSubDistricts(selectedDistrict.value);
        }
    };

    const handleSubDistrictChange = (selectedSubDistrict: any) => {
        if (selectedSubDistrict?.value) {
            setValue("subdistrict", selectedSubDistrict.value.toString());
            const sub = subDistricts.find(s => s.id === selectedSubDistrict.value);
            if (sub) setValue("zip_code", sub.zip_code);
        }
    };

    const handlePasswordFocus = () => setPasswordFocused(true);
    const handlePasswordBlur = () => setPasswordFocused(false);

    const onSubmit = async (data: RegisterFormValues) => {
        const matchedCompany = companies.find(company => company.excise_id === data.tax_registration);

        if (!matchedCompany) {
            console.error("ไม่พบบริษัท");
            return;
        }

        const factoryIds = selectedFactoryId.map(f => f.value);

        const userData: UserData = {
            company_id: matchedCompany.id,
            factory_id: factoryIds,
            email: data.email,
            phone: data.phone,
            password: data.password,
            confirm_password: data.confirmPassword,
            address_line_1: data.address,
            address_line_2: [data.road, data.alley, data.village].filter(Boolean).join(" "),
            province_id: Number(data.province),
            district_id: Number(data.district),
            sub_district_id: Number(data.subdistrict),
        };

        console.log("ส่งข้อมูล:", userData);

        try {
            const response = await apiRegister(userData);
            if (response) {
                console.log("Register Success:", response);
                navigate('/login');
            }
        } catch (error) {
            console.error("Register Failed:", error);
        }
    };

    const validatePassword = (password: string) => {
        setPassword(password);
        setPasswordValidation({
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            isValidLength: password.length >= 8 && password.length <= 16
        });
    };

    const renderValidationIcon = (condition: boolean) => {
        return condition ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />;
    };

    const passwordPopover = (
        <Popover id="popover-password">
            <Popover.Header as="h3">เงื่อนไขการตั้งรหัสผ่าน</Popover.Header>
            <Popover.Body>
                <ul className="list-unstyled">
                    <li>{renderValidationIcon(passwordValidation.hasUpperCase)} ต้องมีตัวอักษร **พิมพ์ใหญ่** อย่างน้อย 1 ตัว</li>
                    <li>{renderValidationIcon(passwordValidation.hasLowerCase)} ต้องมีตัวอักษร **พิมพ์เล็ก** อย่างน้อย 1 ตัว</li>
                    <li>{renderValidationIcon(passwordValidation.hasNumber)} ต้องมีตัวเลขอย่างน้อย 1 ตัว</li>
                    <li>{renderValidationIcon(passwordValidation.isValidLength)} ความยาวไม่น้อยกว่า **8** ตัว และไม่มากกว่า **16** ตัว</li>
                </ul>
            </Popover.Body>
        </Popover>
    );

    return (
        <div
            className="d-flex justify-content-center align-items-center p-5"
            style={{
                background: `url(${bgRegister}) center / cover`,
                minHeight: "100vh",
            }}
        >
            <div
                className="text-white rounded-4 p-5 w-100"
                style={{
                    maxWidth: "1600px",
                    backgroundColor: "#151513",
                }}
            >
                <div className="container-fluid" style={{ maxWidth: '900px' }}>
                    <div className="text-start mb-4" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
                        <p className="fw-bold text-start ps-3" style={{ fontSize: "38px" }}>
                            ลงทะเบียนเข้าใช้งาน
                        </p>
                        <img className="img-fluid ps-3" src={lineTop} alt="Line Top" style={{ width: "60%" }} />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ fontFamily: 'Sarabun' }}>
                        <div className="position-relative">
                            {/* ข้อมูลส่วนที่ 1 */}
                            <div className="p-3 rounded-0 mb-2 position-relative" style={{ zIndex: 1 }}>
                                <div className="row g-3 pe-2 pb-3">
                                    <div className="col-md-12">
                                        <label className="form-label">เลขทะเบียนสรรพสามิต</label>
                                        {errors.tax_registration && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.tax_registration?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input
                                                className="form-control"
                                                {...register("tax_registration")}
                                                onChange={handleTaxChange}
                                                maxLength={17}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อบริษัท</label>
                                        {errors.company_name && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.company_name?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("company_name")} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อโรงงานอุตสาหกรรม</label>
                                        <div className="">
                                            <Select<FactoryOption, true>
                                                isMulti
                                                options={factoryOptions}
                                                value={selectedFactoryId}
                                                onChange={(selected: MultiValue<FactoryOption>) => {
                                                    const mutableSelected = [...selected];
                                                    setSelectedFactoryId(mutableSelected);
                                                    const factoryNames = mutableSelected.map((s) => s.label).join(", ");
                                                    setValue("factory_name", factoryNames);
                                                }}
                                                placeholder="เลือกโรงงาน"
                                                styles={selectFactory<FactoryOption, true>()}
                                                isDisabled={factoryOptions.length === 0}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">อีเมล</label>
                                        {errors.email && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.email?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input
                                                type="email"
                                                className="form-control" {...register("email")}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^a-zA-Z0-9@.]/g, "");
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">เบอร์โทรศัพท์</label>
                                        {errors.phone && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.phone?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                {...register("phone")}
                                                maxLength={10}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">รหัสผ่าน</label>
                                        {errors.password && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.password?.message}</span>
                                        )}
                                        <div className="input-regis position-relative">
                                            <OverlayTrigger
                                                trigger="focus"
                                                placement="left"
                                                overlay={passwordPopover}
                                                show={passwordFocused}
                                            >
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    {...register("password")}
                                                    value={password}
                                                    onChange={(e) => validatePassword(e.target.value)}
                                                    onFocus={handlePasswordFocus}
                                                    onBlur={handlePasswordBlur}
                                                />
                                            </OverlayTrigger>
                                            <span
                                                onClick={() => setShowPassword(prev => !prev)}
                                                className="position-absolute top-50 end-0 translate-middle-y me-3"
                                                style={{ cursor: "pointer" }}
                                            >
                                                {showPassword ? (
                                                    <IoEyeOffSharp size={20} color="black" />
                                                ) : (
                                                    <IoEyeSharp size={20} color="black" />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ยืนยันรหัสผ่าน</label>
                                        {errors.confirmPassword && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.confirmPassword?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input type="password" className="form-control" {...register("confirmPassword")} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <img
                                className="img-fluid"
                                src={frameImage}
                                alt="Frame"
                                style={{
                                    position: 'absolute',
                                    width: '98%',
                                    height: '90%',
                                    bottom: 0,
                                    right: 0,
                                    transform: 'translateY(0%)',
                                }}
                            />
                        </div>

                        {/* ข้อมูลส่วนที่ 2 */}
                        <div className="position-relative">
                            <img
                                src={borderLeft}
                                alt="Frame for Part 2"
                                className="img-fluid"
                                style={{
                                    position: 'absolute',
                                    width: '0.5%',
                                    height: '100%',
                                    left: '-30px',
                                    top: '47%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                }}
                            />
                            <div className="p-3 rounded-0 mb-4 position-relative" style={{ zIndex: 1 }}>
                                <div className="row g-3 pe-2">
                                    <div className="col-md-6">
                                        <label className="form-label">สถานที่ตั้ง</label>
                                        {errors.address && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.address?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("address")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ถนน</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" {...register("road")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ตรอก/ซอย</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" {...register("alley")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">หมู่ที่</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" {...register("village")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">จังหวัด</label>
                                        {errors.province && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.province?.message}</span>
                                        )}
                                        <Select
                                            options={provinces.map(p => ({ value: p.id, label: p.name }))}
                                            onChange={handleProvinceChange}
                                            placeholder="เลือกจังหวัด"
                                            styles={selectLocation}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">อำเภอ/เขต</label>
                                        {errors.district && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.district?.message}</span>
                                        )}
                                        <Select
                                            options={districts.map(d => ({ value: d.id, label: d.name }))}
                                            onChange={handleDistrictChange}
                                            placeholder="เลือกอำเภอ/เขต"
                                            styles={selectLocation}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ตำบล/แขวง</label>
                                        {errors.subdistrict && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.subdistrict?.message}</span>
                                        )}
                                        <Select
                                            options={subDistricts.map(s => ({ value: s.id, label: s.name }))}
                                            onChange={handleSubDistrictChange}
                                            placeholder="เลือกตำบล/แขวง"
                                            styles={selectLocation}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">รหัสไปรษณีย์</label>
                                        {errors.zip_code && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.zip_code?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("zip_code")} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ส่วนของปุ่ม */}
                        <div className="d-flex justify-content-center gap-3">
                            <Button
                                type="button"
                                label="ย้อนกลับ"
                                bgColor="#717171"
                                maxWidth="150px"
                                hoverBgColor="#FFFF"
                                variant="bg-hide"
                                onClick={() => navigate('/login')}
                            />

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
            </div>
        </div>
    );
};

export default Register;
