import React from "react";
import { MaterialUsageTable, ProductionTable } from "../component/ProductionTables";
import { MaterialUsageData, ProductionData } from "../../types/productionTypes";

type Props = {
    materialUsageData: MaterialUsageData;
    productionData: ProductionData;
};

const ProductionReport: React.FC<Props> = ({
    materialUsageData,
    productionData,
}) => {
    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <MaterialUsageTable data={materialUsageData} />
            <ProductionTable data={productionData} />
        </div>
    );
};

export default ProductionReport;
