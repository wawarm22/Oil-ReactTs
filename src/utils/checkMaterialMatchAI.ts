export const checkMaterialMatchAI = async (text: string, pattern: string): Promise<boolean> => {
    if (!text || !pattern) return false;

    const cleanedText = text.replace(/\s+/g, "").toLowerCase();
    const cleanedPattern = pattern.replace(/\s+/g, "").toLowerCase();

    return cleanedText.includes(cleanedPattern);
};

export const checkProductMatchAI = async (text: string, pattern: string): Promise<boolean> => {
    if (!text || !pattern) return false;

    const cleanedText = text.replace(/\s+/g, "").toLowerCase();
    const cleanedPattern = pattern.replace(/\s+/g, "").toLowerCase();

    return cleanedText.includes(cleanedPattern);
};
