import dayjs from "dayjs";

export type UserData = {
    company_id: number;
    factory_id: number[]; 
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
    address_line_1: string;
    address_line_2: string;
    province_id: number;
    district_id: number;
    sub_district_id: number;
};

export type User = {
  id: number;
  company_id: number;
  email: string;
  phone: string;
  address_line_1: string | null;
  address_line_2: string | null;
  address_street: string | null;
  alley: string | null;
  village: string | null;
  province_id: number;
  district_id: number;
  sub_district_id: number;
  zip_code: string | null;
  verify_date?: dayjs.Dayjs | null;
}

