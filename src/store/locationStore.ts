// store/locationStore.ts
import { create } from 'zustand';
import { apiLocation } from '../utils/api/locationApi';
import { DistrictNew, ProvinceNew, SubDistrictNew } from '../types/locationTypes';

interface LocationState {
  provinces: ProvinceNew[];
  selectedDistricts: DistrictNew[];
  selectedSubDistricts: SubDistrictNew[];
  loading: boolean;
  fetchLocations: () => Promise<void>;
  filterDistricts: (provinceId: number) => void;
  filterSubDistricts: (districtId: number) => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  provinces: [],
  selectedDistricts: [],
  selectedSubDistricts: [],
  loading: false,

  fetchLocations: async () => {
    set({ loading: true });
    try {
      const res = await apiLocation();
      if (res.status) {
        set({ provinces: res.data });
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      set({ loading: false });
    }
  },

  filterDistricts: (provinceId: number) => {
    const province = get().provinces.find(p => p.id === provinceId);
    set({ selectedDistricts: province?.districts || [], selectedSubDistricts: [] });
  },

  filterSubDistricts: (districtId: number) => {
    const district = get().selectedDistricts.find(d => d.id === districtId);
    set({ selectedSubDistricts: district?.sub_districts || [] });
  }
}));
