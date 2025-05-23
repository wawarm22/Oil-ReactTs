export type CheckProductTypeResponse = {
    QueryId: string;
    TotalNumberOfResults: number;
    ResultItems: {
        DocumentURL: string;
        Id: string;
        Response: {
            Company: string;
            CompanyName: string;
            Id: string;
            ProductName: string;
            ProductType: string;
        };
        ScoreAttributes: {
            ScoreConfidence: string;
        }
    }[];
    ResponseMetadata: {
        HTTPHeaders: Record<string, string>;
    };
};

export type CheckProductTypeResultItem = {
    DocumentURL: string;
    Id: string;
    Response: {
        Company: string;
        CompanyName: string;
        Id: string;
        ProductName: string;
        ProductType: string;
    };
    ScoreAttributes: {
        ScoreConfidence: string;
    };
};


