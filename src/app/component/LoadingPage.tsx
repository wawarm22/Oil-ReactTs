import React from "react";
import OilDropletLoader from "../reusable/OilDropletLoader";

const LoadingPage: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    return (
        <>
            {isLoading && (
                <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                    <OilDropletLoader />
                </div>
            )}
        </>
    );
};

export default LoadingPage;
