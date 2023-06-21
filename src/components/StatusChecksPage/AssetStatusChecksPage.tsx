import React, { useState } from "react";
import StatusCard from "./StatusCard";
import StatusDetails from "./StatusDetails";
import AddStatusForm from "./AddStatusForm";

const selectedAssetCheck = {
    uptime_check_id: "",
    asset_id: "",
    status_check: "",
    images_array: [],
    modified_by: "",
    modified_date: "",
    uptime_notes: "",

}

const AssetStatusChecksPage = () => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [addFormOpen, setAddFormOpen] = useState(false)
    return (
        <div className="w-full">
            <div className="flex flex-row items-center">
                <h1 className="text-blue-900 dark:text-blue-600 font-sans font-semibold">Status Checks</h1>
                <button className="btn bg-blue-900 ml-auto" onClick={() => setAddFormOpen(true)}>+Add</button>
            </div>
            {/* Map Status Cards here */}
            <div className={`${detailsOpen ? "hidden" : ""}`}>
                <StatusCard
                    status={"active"}
                    // date={new Date(assetCheck.modified_date)}
                    // onClick={() => handleStatusCardClick(assetCheck.uptime_check_id)}
                    date={new Date}
                    onClick={() => setDetailsOpen(true)}
                    uptime_notes={"note"}
                />
                <StatusCard
                    status={"active"}
                    // date={new Date(assetCheck.modified_date)}
                    // onClick={() => handleStatusCardClick(assetCheck.uptime_check_id)}
                    date={new Date}
                    onClick={() => setDetailsOpen(true)}
                    uptime_notes={"note"}
                />
            </div>

            <div className={`${detailsOpen ? "" : "hidden"}`}>
                {/* Map status details */}
                <StatusDetails
                    sessionToken={"1231241"}
                    uptimeCheckId={selectedAssetCheck?.uptime_check_id || ""}
                    assetId={selectedAssetCheck?.asset_id || ""}
                    statusCheck={selectedAssetCheck?.status_check || ""}
                    imageArray={selectedAssetCheck?.images_array || []}
                    modifiedBy={selectedAssetCheck?.modified_by || ""}
                    modifiedDate={selectedAssetCheck?.modified_date || ""}
                    uptimeNotes={selectedAssetCheck?.uptime_notes || ""}
                    refreshAssets={() => { console.log("refresh assets") }}
                    closeAsset={() => { setDetailsOpen(false) }}
                />
            </div>
            <div>
                <AddStatusForm
                    addFormOpen={addFormOpen}
                    setAddFormOpen={() => setAddFormOpen(false)}
                    assetId={selectedAssetCheck.asset_id}
                    onStatusAdded={() => console.log("")}
                />
            </div>
        </div>
    )
}

export default AssetStatusChecksPage