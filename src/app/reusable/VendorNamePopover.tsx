import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

type Props = {
    slug?: string;
    name?: string;
};

const VendorNamePopover: React.FC<Props> = ({ slug, name }) => {
    if (!slug) return null;

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 150, hide: 100 }}
            overlay={
                <Popover
                    id="popover-vendor-name"
                    className="shadow border"
                    style={{
                        minWidth: 250,
                    }}
                >
                    <Popover.Header
                        as="h3"
                        className="fw-bold"
                        style={{
                            background: "#3D4957",
                            color: "#ffff",
                            fontSize: 16,
                        }}
                    >
                        ชื่อเต็มโรงกลั่น/คลัง
                    </Popover.Header>
                    <Popover.Body
                        style={{
                            color: "#1E2329",
                            fontWeight: 500,
                            fontSize: 15,
                        }}
                    >
                        {name ? name : <span className="text-muted">-</span>}
                    </Popover.Body>
                </Popover>
            }
        >
            <span
                className="rounded-3 pb-1"
                style={{
                    cursor: name ? "pointer" : "default",
                    color: "#ffff",
                    background: "#3D4957",
                    padding: "3px 10px",
                    fontWeight: 600,
                    outline: "none"
                }}
                tabIndex={0}
            >
                {slug}
            </span>
        </OverlayTrigger>
    );
};

export default VendorNamePopover;
