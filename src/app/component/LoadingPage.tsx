import React, { useEffect, useState } from "react";
import OilDropletLoader from "../reusable/OilDropletLoader";

const LoadingPage: React.FC<{ onLoaded: () => void }> = ({ onLoaded }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            onLoaded();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            {loading ? (
                <>
                    <OilDropletLoader />
                </>
            ) : null}
        </div>
    );
};

export default LoadingPage;
