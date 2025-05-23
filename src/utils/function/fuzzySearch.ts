import Fuse from "fuse.js";
import { CheckProductTypeResultItem } from "../../types/checkData";

export function findBestMatch(
    resultItems: CheckProductTypeResultItem[],
    companyName: string,
    factoryName: string
): string {
    if (!resultItems || resultItems.length === 0) {
        console.log("No resultItems provided or empty array.");
        return "";
    }

    // console.log("Original resultItems count:", resultItems.length);

    // กรองตาม companyName ก่อน
    const filteredByCompany = resultItems.filter(
        item => item.Response?.Company === companyName
    );

    // console.log("Filtered company names:", filteredByCompany.map(i => i.Response.CompanyName));

    const fuse = new Fuse(filteredByCompany, {
        keys: ["Response.CompanyName"],
        includeScore: true,
        threshold: 0.5,
        distance: 100,
        ignoreLocation: true,
        isCaseSensitive: false,
    });

    const cleanFactoryName = factoryName.replace(/\[[^\]]+\]\s*/, '').toLowerCase();
    // console.log(`Searching factoryName: "${cleanFactoryName}" using Fuse.js`);

    const results = fuse.search(cleanFactoryName);
    // console.log("Fuse.js search results:", results.map(r => ({
    //     companyName: r.item.Response.CompanyName,
    //     score: r.score,
    //     productName: r.item.Response.ProductName
    // })));

    if (results.length > 0) {
        return results[0].item.Response.Id ?? "";
    }
    return filteredByCompany[0]?.Response?.Id ?? "";

}
