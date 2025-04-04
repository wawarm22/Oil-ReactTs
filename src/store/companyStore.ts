import { create } from 'zustand';
import { Company, CompanyById } from '../types/companyTypes';
import { apiCompanyAll, apiCompanyById } from '../utils/api/companyDataApi';

interface CompanyState {
  companies: Company[];
  selectedCompany: CompanyById | null;
  isLoading: boolean;
  error: string | null;

  fetchCompanies: () => Promise<void>;
  fetchCompanyById: (id: number) => Promise<void>;
  reset: () => void; // ✅ เพิ่ม type
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiCompanyAll();
      set({ companies: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
        isLoading: false,
      });
    }
  },

  fetchCompanyById: async (id: number) => {
    set({ selectedCompany: null, isLoading: true, error: null }); // 🧼 reset ก่อน fetch
    try {
      const res = await apiCompanyById(id);
      set({ selectedCompany: res, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
        isLoading: false,
      });
    }
  },

  reset: () => set({
    companies: [],
    selectedCompany: null,
    isLoading: false,
    error: null,
  }) // ✅ reset state ทั้งหมด
}));
