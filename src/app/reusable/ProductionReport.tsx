import React from "react";
import { materialUsageData, productionData } from "../../types/productionTypes";
import { MaterialUsageTable, ProductionTable } from "../component/ProductionTables";

const ProductionReport: React.FC = () => {
    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px', fontFamily: "IBM Plex Sans Thai" }}>
            <MaterialUsageTable data={materialUsageData} />
            <ProductionTable data={productionData} />
        </div>
    );
};

export default ProductionReport;
