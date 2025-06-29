// useOrcStore.ts

import { create } from 'zustand';
import { ContextByDocType, OcrByDocIdType, ValidateResultsByDoc } from '../types/checkList';
import { apiGetAllOcr } from '../utils/api/OcrListApi';
import { documentList } from '../types/docList';
import { OCR_VALIDATE_MAP } from '../utils/function/ocrValidateMap';
import { getContextForDocType } from '../utils/contextGetters';

interface OcrStoreState {
  ocrByDocId: OcrByDocIdType;
  loadingOcr: boolean;
  validateResultsByDoc: ValidateResultsByDoc;
  contextByDoc: ContextByDocType;
  validationFailStatus: Record<string, boolean>;
  folders: string[];
  setFolders: (folders: string[]) => void;
  fetchOcrData: (folders: string[], auth?: any) => Promise<void>;
  batchValidateAll: (auth?: any) => Promise<void>;
  reset: () => void;
}

export const useOcrStore = create<OcrStoreState>((set, get) => ({
  ocrByDocId: {},
  loadingOcr: false,
  validateResultsByDoc: {},
  contextByDoc: {},
  validationFailStatus: {},
  folders: [],
  setFolders: (folders) => set({ folders }),

  fetchOcrData: async (folders) => {
    set({ loadingOcr: true });
    const results: OcrByDocIdType = {};
    for (const folder of folders) {
      try {
        const data = await apiGetAllOcr(folder);
        const documents = data?.documents ?? [];
        for (const document of documents) {
          const fileName = document.plainOriginalFileName ?? "";
          const fileKey = fileName.replace(/\.pdf_page\d+$/, "");
          const groupParts = fileName.split("/");
          const len = groupParts.length;
          let docId = 0;
          let subtitleIndex = 0;
          if (len >= 2 && !isNaN(Number(groupParts[len - 2]))) {
            docId = parseInt(groupParts[len - 2]);
          }
          if (len >= 3 && !isNaN(Number(groupParts[len - 3])) && !isNaN(Number(groupParts[len - 2]))) {
            docId = parseInt(groupParts[len - 3]);
            subtitleIndex = parseInt(groupParts[len - 2]) - 1;
          }
          const pageNumber = parseInt(document.pageNumber ?? "1");
          const pageCount = parseInt(document.pageCount ?? "1");

          if (!results[docId]) results[docId] = {};
          if (!results[docId][subtitleIndex]) results[docId][subtitleIndex] = {};
          if (!results[docId][subtitleIndex][fileKey]) {
            results[docId][subtitleIndex][fileKey] = { pages: {}, pageCount };
          }
          results[docId][subtitleIndex][fileKey].pages[pageNumber] = {
            ...document.fields,
            fileKey,
            documentGroup: document.documentGroup,
            docType: document.docType,
            id: document.id
          };
        }
      } catch (err) {
        console.error("OCR fetch failed:", err);
      }
    }
    set({ ocrByDocId: results, loadingOcr: false });
  },

  batchValidateAll: async (auth) => {
    const ocrByDocId = get().ocrByDocId;
    if (!ocrByDocId || Object.keys(ocrByDocId).length === 0) return;

    for (const doc of documentList) {
      const docId = doc.id;
      const subtitleLength = doc.subtitle?.length ?? 1;
      for (let subIdx = 0; subIdx < subtitleLength; subIdx++) {
        const docGroup = ocrByDocId[docId]?.[subIdx];
        if (!docGroup) continue;

        const fileKeys = Object.keys(docGroup);
        if (fileKeys.length === 0) continue;

        let allPages: { pageNum: number; docType: string; page: any }[] = [];
        for (const fileKey of fileKeys) {
          const pagesObj = docGroup[fileKey]?.pages;
          if (!pagesObj) continue;
          Object.entries(pagesObj).forEach(([p, page]) => {
            if (page && page.docType) {
              allPages.push({
                pageNum: Number(p),
                docType: page.docType,
                page,
              });
            }
          });
        }
        if (allPages.length === 0) continue;

        for (const { pageNum, docType, page } of allPages) {
          if (!OCR_VALIDATE_MAP[docType]) continue;
          const validateConfig = OCR_VALIDATE_MAP[docType];
          const getContext = getContextForDocType[docType] ?? getContextForDocType["default"];
          let context;
          if (validateConfig.needsAuth) {
            context = await getContext(page, { auth });
          } else {
            context = await getContext(page);
          }
          const payload = await validateConfig.buildPayload(page, context);
          let res;
          try {
            res = await validateConfig.api(payload);
          } catch (e) {
            res = null;
          }

          // ----------- Progressive Update Begins Here -------------
          // 1. เอาค่าเก่าจาก store
          const prevResults = get().validateResultsByDoc;
          const prevStatus = get().validationFailStatus;
          const prevContext = get().contextByDoc;

          // 2. สร้างค่าที่จะอัพเดต
          const newResults = {
            ...prevResults,
            [docId]: {
              ...(prevResults[docId] || {}),
              [subIdx]: {
                ...((prevResults[docId] && prevResults[docId][subIdx]) || {}),
                [pageNum]: { docType, validateResult: res },
              },
            },
          };

          const newContext = {
            ...prevContext,
            [docId]: {
              ...(prevContext[docId] || {}),
              [subIdx]: {
                ...((prevContext[docId] && prevContext[docId][subIdx]) || {}),
                [pageNum]: context,
              },
            },
          };

          // ตัดสินใจว่าจะ set failed หรือไม่
          let failed = validateConfig.checkFailed(res);
          const statusKey = `${docId}-${subIdx}`;
          // ถ้ามี fail อย่างน้อย 1 หน้า set เป็น true ไปเลย
          const newStatus = {
            ...prevStatus,
            [statusKey]: failed || prevStatus[statusKey] || false,
          };

          // 3. อัพเดต store
          set({
            validateResultsByDoc: newResults,
            validationFailStatus: newStatus,
            contextByDoc: newContext,
          });
        }
      }
    }
  },

  reset: () => set({
    ocrByDocId: {},
    loadingOcr: false,
    validateResultsByDoc: {},
    contextByDoc: {},
    validationFailStatus: {},
    folders: [],
  }),
}));
