import { create } from 'zustand';
import { District, Province, SubDistrict } from '../types/locationTypes';
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
      const provinceOptions: Province[] = data.map((province: Province) => ({
        id: province.id,
        name_en: province.name_en,
        name_th: province.name_th,
        geography_id: province.geography_id,
        
      }));
      set({ provinces: provinceOptions });
    } catch (error) {
      console.error("Failed to fetch provinces:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchDistricts: async (province_id: string) => {
    set({ districts: [], subDistricts: [] });
    try {
      const data = await apiDistrict(province_id);
      const districtOptions: District[] = data.map((district: District) => ({
        id: district.id,        
        name_en: district.name_en,
        name_th: district.name_th,
        province_id: district.province_id,
      }));
      set({ districts: districtOptions });
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  },

  fetchSubDistricts: async (amphure_id: string) => {
    set({ subDistricts: [] });
    try {
      const data = await apiSubDistrict(amphure_id);
      const subDistrictOptions: SubDistrict[] = data.map((subdistrict: SubDistrict) => ({
        id: subdistrict.id,
        amphure_id: subdistrict.amphure_id,
        name_en: subdistrict.name_en,
        name_th: subdistrict.name_th,
        zip_code: subdistrict.zip_code,           
      }));
      set({ subDistricts: subDistrictOptions });
    } catch (error) {
      console.error("Failed to fetch subdistricts:", error);
    }
  },
}));
