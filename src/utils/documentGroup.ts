export const checkMaterialMatchAI = async (input: string, checker: string): Promise<boolean> => {
    if (!input || !checker) return false;

    const cleanedText = input.replace(/\s+/g, "").toLowerCase();
    const cleanedPattern = checker.replace(/\s+/g, "").toLowerCase();

    return cleanedText.includes(cleanedPattern);
};

export const checkProductMatchAI = async (input: string, checker: string): Promise<boolean> => {
    if (!input || !checker) return false;

    const cleanedText = input.replace(/\s+/g, "").toLowerCase();
    const cleanedPattern = checker.replace(/\s+/g, "").toLowerCase();

    return cleanedText.includes(cleanedPattern);
};
