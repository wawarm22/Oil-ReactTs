import React, { useEffect } from "react";
import '../../assets/css/input-highlights.css'
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import bgRegister from "../../assets/img/bg-regis.png";
import lineTop from "../../assets/img/line-top.png";
import Button from "../reusable/Button";
import frameImage from "../../assets/img/boeder-right.png";
import borderLeft from "../../assets/img/border-left.png";
import { RegisterFormValues, registerSchema } from "../schemas/registerSchema";
import { selectLocation } from "../../assets/style/selectLocation";
import { useLocationStore } from "../../store/locationStore";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            province: "",
            district: "",
            subdsitrict: "",
        }
    });

    const { provinces, districts, subDistricts, fetchProvinces, fetchDistricts, fetchSubDistricts } = useLocationStore();

    useEffect(() => {        
        fetchProvinces();
    }, [fetchProvinces]);

    const handleProvinceChange = (selectedProvince: any) => {
        if (selectedProvince?.value) {
            setValue("province", selectedProvince.value);
            fetchDistricts(selectedProvince.value);
        }
    };

    const handleDistrictChange = (selectedDistrict: any) => {
        if (selectedDistrict?.value) {
            setValue("district", selectedDistrict.value.toString());
            fetchSubDistricts(selectedDistrict.value, selectedDistrict.value);
        }
    };

    const handleSubDistrictChange = (selectedSubDistrict: any) => {
        if (selectedSubDistrict?.value) {
            setValue("subdsitrict", selectedSubDistrict.value.toString());
            
            // แปลง selectedSubDistrict.value เป็น number
            const selected = subDistricts.find(subdistrict => subdistrict.amphure_id === Number(selectedSubDistrict.value));
            
            if (selected) {
                setValue("postcode", selected.zip_code.toString());
            }
        }
    };
    

    const onSubmit = (data: RegisterFormValues) => {
        console.log("สมัครสมาชิกสำเร็จ", data);
    };

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
                                        {errors.taxId && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.taxId?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("taxId")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อบริษัท</label>
                                        {errors.companyName && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.companyName?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("companyName")} />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <label className="form-label">คำนำหน้าชื่อ</label>
                                        <select className="form-select input-group">
                                            <option>เลือก...</option>
                                            <option>นาย</option>
                                            <option>นาง</option>
                                            <option>นางสาว</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อ</label>
                                        {errors.firstName && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.firstName?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("firstName")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">นามสกุล</label>
                                        {errors.lastName && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.lastName?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("lastName")} />
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อโรงงานอุตสาหกรรม</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
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
                                        <div className="input-regis">
                                            <input type="password" className="form-control" {...register("password")} />
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
                                        {errors.location && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.location?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("location")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ถนน</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ตรอก/ซอย</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">หมู่ที่</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">จังหวัด</label>
                                        {errors.province && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.province?.message}</span>
                                        )}
                                        <Select

                                            options={provinces.map(province => ({
                                                value: province.id,
                                                label: province.name_th
                                            }))}
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
                                            options={districts.map(district => ({
                                                value: district.id,
                                                label: district.name_th
                                            }))}
                                            onChange={handleDistrictChange}
                                            placeholder="เลือกอำเภอ/เขต"
                                            styles={selectLocation}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ตำบล/แขวง</label>
                                        {errors.subdsitrict && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.subdsitrict?.message}</span>
                                        )}
                                        <Select
                                            options={subDistricts.map(subdistrict => ({
                                                value: subdistrict.amphure_id,
                                                label: subdistrict.name_th
                                            }))}
                                            onChange={handleSubDistrictChange}
                                            placeholder="เลือกตำบล/แขวง"
                                            styles={selectLocation}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">รหัสไปรษณีย์</label>
                                        {errors.postcode && (
                                            <span className="text-danger ms-3 fw-bold">* {errors.postcode?.message}</span>
                                        )}
                                        <div className="input-regis">
                                            <input className="form-control" {...register("postcode")} readOnly/>
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
