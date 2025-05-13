export const parseUploadedStatus = (folders: string[]): { [docId: number]: Set<number> } => {
    const status: { [docId: number]: Set<number> } = {};

    folders.forEach(folder => {
        const parts = folder.split("/");

        const last = parts[parts.length - 1];            
        const secondLast = parts[parts.length - 2];      

        if (!isNaN(Number(last)) && !isNaN(Number(secondLast))) {
            const docId = parseInt(secondLast, 10);
            const subtitleIndex = parseInt(last, 10) - 1;

            if (!status[docId]) status[docId] = new Set();
            status[docId].add(subtitleIndex);
        } else if (!isNaN(Number(last))) {
            const docId = parseInt(last, 10);

            if (!status[docId]) status[docId] = new Set();
            status[docId].add(0);
        }
    });

    return status;
};
