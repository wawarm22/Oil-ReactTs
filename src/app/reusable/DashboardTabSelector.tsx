import React from "react";

type TabType = "yearly" | "monthly";

interface DashboardTabSelectorProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const DashboardTabSelector: React.FC<DashboardTabSelectorProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <div className="d-flex align-items-center border-bottom mb-3">
            <div
                className="me-4 pb-2 cursor-pointer"
                style={{
                    fontWeight: activeTab === "yearly" ? "bold" : "normal",
                    color: activeTab === "yearly" ? "#000" : "#ccc",
                    borderBottom: activeTab === "yearly" ? "4px solid #FFCC01" : "4px solid transparent",
                    transition: "all 0.2s",
                    cursor: "pointer"
                }}
                onClick={() => onTabChange("yearly")}
            >
                รายปี
            </div>
            <div
                className="pb-2 cursor-pointer"
                style={{
                    fontWeight: activeTab === "monthly" ? "bold" : "normal",
                    color: activeTab === "monthly" ? "#000" : "#ccc",
                    borderBottom: activeTab === "monthly" ? "4px solid #FFCC01" : "4px solid transparent",
                    transition: "all 0.2s",
                    cursor: "pointer"
                }}
                onClick={() => onTabChange("monthly")}
            >
                รายเดือน
            </div>
        </div>
    );
};

export default DashboardTabSelector;
