import { create } from 'zustand';
import { Company } from '../types/companyTypes';
import { apiCompanyAll } from '../utils/api/CompanyDataApi';

interface CompanyState {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
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
  }
}));
