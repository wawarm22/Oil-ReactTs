// src/store/locationStore.ts
import { create } from 'zustand';
import { Province, District, SubDistrict } from '../types/locationTypes';
import { apiDistrict, apiProvince, apiSubDistrict } from '../utils/api/locationApi';

interface LocationState {
  provinces: Province[];
  districts: District[];
  subDistricts: SubDistrict[];
  loading: boolean;
  fetchProvinces: () => void;
  fetchDistricts: (provinceCode: string) => void;
  fetchSubDistricts: (provinceCode: string, districtCode: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  provinces: [],
  districts: [],
  subDistricts: [],
  loading: true,

  fetchProvinces: async () => {
    set({ loading: true });
    try {
      const data = await apiProvince();
      const provinceOptions: Province[] = data.data.map((province: Province) => ({
        Id: province.Id,
        PvCode: province.PvCode,
        NameEn: province.NameEn,
        NameTh: province.NameTh,
      }));
      set({ provinces: provinceOptions });
    } catch (error) {
      console.error("Failed to fetch provinces:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchDistricts: async (provinceCode: string) => {
    set({ districts: [], subDistricts: [] });
    try {
      const data = await apiDistrict(provinceCode);
      const districtOptions: District[] = data.data.map((district: District) => ({
        Id: district.Id,
        PvCode: district.PvCode,
        DistCode: district.DistCode,
        NameEn: district.NameEn,
        NameTh: district.NameTh,
      }));
      set({ districts: districtOptions });
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  },

  fetchSubDistricts: async (provinceCode: string, districtCode: string) => {
    set({ subDistricts: [] });
    try {
      const data = await apiSubDistrict(provinceCode, districtCode);
      const subDistrictOptions: SubDistrict[] = data.data.map((subdistrict: SubDistrict) => ({
        Id: subdistrict.Id,
        PvCode: subdistrict.PvCode,
        DistCode: subdistrict.DistCode,
        SubdistCode: subdistrict.SubdistCode,
        NameEn: subdistrict.NameEn,
        NameTh: subdistrict.NameTh,
        PostCode: subdistrict.PostCode,           
      }));
      set({ subDistricts: subDistrictOptions });
    } catch (error) {
      console.error("Failed to fetch subdistricts:", error);
    }
  },
}));
