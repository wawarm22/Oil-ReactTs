export interface TaxRefundItem {
    date: number;
    finishedOilVolume: number;
    taxRate03_07: number;
    exciseTax03_07: number;
    surcharge03_07: number;
    baseOilVolume: number;
    taxRate05_03: number;
    exciseTax05_03: number;
    surcharge05_03: number;
    taxDiff: number;
    surchargeTotal: number;
    taxRefund: number;
}

export const taxRefundData: TaxRefundItem[] = [
    { date: 1, finishedOilVolume: 583159, taxRate03_07: 5.9900, exciseTax03_07: 3493112.41, surcharge03_07: 349312.24, baseOilVolume: 543348, taxRate05_03: 6.4400, exciseTax05_03: 3499161.12, surcharge05_03: 349916.11, taxDiff: 6038.71, surchargeTotal: 603.87, taxRefund: 6642.58 },
    { date: 2, finishedOilVolume: 637094, taxRate03_07: 5.9900, exciseTax03_07: 3816193.06, surcharge03_07: 381619.31, baseOilVolume: 593605, taxRate05_03: 6.4400, exciseTax05_03: 3828216.20, surcharge05_03: 382281.62, taxDiff: 6623.14, surchargeTotal: 662.31, taxRefund: 7285.45 },
    { date: 3, finishedOilVolume: 768869, taxRate03_07: 5.9900, exciseTax03_07: 4605525.31, surcharge03_07: 460552.53, baseOilVolume: 716356, taxRate05_03: 6.4400, exciseTax05_03: 4613336.24, surcharge05_03: 461333.26, taxDiff: 7807.33, surchargeTotal: 780.73, taxRefund: 8588.06 },
    { date: 4, finishedOilVolume: 706671, taxRate03_07: 5.9900, exciseTax03_07: 4232295.93, surcharge03_07: 423229.59, baseOilVolume: 658398, taxRate05_03: 6.4400, exciseTax05_03: 4240832.18, surcharge05_03: 424083.22, taxDiff: 7123.83, surchargeTotal: 712.38, taxRefund: 7836.21 },
    { date: 5, finishedOilVolume: 627535, taxRate03_07: 5.9900, exciseTax03_07: 3758934.65, surcharge03_07: 375893.47, baseOilVolume: 582058, taxRate05_03: 6.4400, exciseTax05_03: 3765165.25, surcharge05_03: 376516.53, taxDiff: 6230.60, surchargeTotal: 623.06, taxRefund: 6853.74 },
    { date: 6, finishedOilVolume: 680800, taxRate03_07: 5.9900, exciseTax03_07: 4077799.20, surcharge03_07: 407799.20, baseOilVolume: 634299, taxRate05_03: 6.4400, exciseTax05_03: 4084885.56, surcharge05_03: 408488.56, taxDiff: 6893.56, surchargeTotal: 689.36, taxRefund: 7582.92 },
];

