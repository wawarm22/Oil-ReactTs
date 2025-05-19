export type CheckProductTypeResponse = {
    QueryId: string;
    ResultItems: {
        DocumentExcerpt: {
            Response: {
                Company: string;
                CompanyName: string;
                Id: string;
                ProductName: string;
                ProductType: string;
            };
        };
    }[];
    ResponseMetadata: {
        HTTPHeaders: Record<string, string>;
    };
};
