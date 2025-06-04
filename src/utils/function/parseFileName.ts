export const extractDateCodeFromFileName = (fileName: string): string | null => {
    const parts = fileName.split('/');
    if (parts.length > 1 && parts[1].length >= 6) {
        return parts[1].substring(0, 6);
    }
    return null;
}
