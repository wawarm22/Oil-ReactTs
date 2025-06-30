import { useEffect } from "react";
import { useOcrStore } from "../store/useOcrStore";
import { useSocket } from "./socket";

export function useOcrSocketRefresh() {
  const { fetchOcrData, folders } = useOcrStore();
  const { addCallbacks, removeCallbacks } = useSocket();

  useEffect(() => {
    const refreshOCR = () => {
      fetchOcrData(folders);
    };
    addCallbacks("ocr-refresh-checklist", refreshOCR);
    return () => removeCallbacks("ocr-refresh-checklist");
  }, [folders, fetchOcrData]);
}
