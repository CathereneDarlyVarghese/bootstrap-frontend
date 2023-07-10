import React, { useEffect, useState } from "react";
import StatusCard from "./StatusCard";
import StatusDetails from "./StatusDetails";
import AddStatusForm from "./AddStatusForm";
import { getAssetCheckById } from "services/assetCheckServices";
import { IncomingAssetCheck } from "types";
import { Auth } from "aws-amplify";
import { getAssetTypeById } from "services/assetTypeServices";

// interface AssetCheck {
//   uptime_check_id: string;
//   asset_id: string;
//   status_check: string;
//   images_array: string[];
//   modified_by: string;
//   modified_date: string;
//   uptime_notes: string;
// }

// const selectedAssetCheck: IncomingAssetCheck = {
//     uptime_check_id: "",
//     asset_id: "",
//     status_check: "",
//     images_array: [][],
//     modified_by: "",
//     modified_date: "",
//     uptime_notes: "",
//     file_id: ""
// };

interface AssetStatusChecksPageProps {
  sessionToken: string;
  assetId: string;
  setAssetId: React.Dispatch<React.SetStateAction<string | null>>;
  assetType: string;
  assetTypeId: string;
}

const AssetStatusChecksPage: React.FC<AssetStatusChecksPageProps> = ({
  sessionToken,
  assetId,
  setAssetId,
  assetType,
  assetTypeId,
}) => {
  const [statusCheckId, setStatusCheckId] = useState<string | null>(null);
  const [assetChecks, setAssetChecks] = useState<IncomingAssetCheck[]>([]);
  const [selectedAssetCheck, setSelectedAssetCheck] =
    useState<IncomingAssetCheck>();
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const refreshAssets = () => {
    setAssetId(null);
    // Toggle the assetId state to trigger refresh
  };

  const handleStatusAdded = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const response = await getAssetCheckById(
        userData.signInUserSession.accessToken.jwtToken,
        assetId
      );
      setAssetChecks(response);
      console.log("status Checks Fetched ==>>", response);
    } catch (error) {
      console.log("Error fetching asset checks:", error);
    }
  };

  const handleStatusCardClick = (selectedStatusCheckId: string) => {
    setStatusCheckId(selectedStatusCheckId);
    setDetailsOpen(true);
    const selectedAssetCheck = assetChecks.find(
      (assetCheck) => assetCheck.uptime_check_id === selectedStatusCheckId
    );
    setSelectedAssetCheck(selectedAssetCheck);
    console.log("Selected Status CHeck==>>", selectedAssetCheck);
  };

  useEffect(() => {
    const fetchAssetChecks = async () => {
      try {
        const response = await getAssetCheckById(sessionToken, assetId);
        setAssetChecks(response);
        console.log("status Checks Fetched ==>>", response);
      } catch (error) {
        console.log("Error fetching asset checks:", error);
      }
    };

    fetchAssetChecks();
  }, [assetId]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center">
        <h1 className="text-blue-900 dark:text-blue-600 font-sans font-semibold">
          Status Checks
        </h1>
        <button
          className="btn bg-blue-900 ml-auto"
          onClick={() => setAddFormOpen(true)}
        >
          +Add
        </button>
      </div>
      {/* Map Status Cards here */}
      <div className={`${detailsOpen ? "hidden" : ""}`}>
        {assetChecks
          .sort(
            (a, b) =>
              new Date(b.modified_date).getTime() -
              new Date(a.modified_date).getTime()
          )
          .map((assetCheck) => (
            <StatusCard
              status={assetCheck.status_check}
              date={new Date(assetCheck.modified_date)}
              onClick={() => handleStatusCardClick(assetCheck.uptime_check_id)}
              uptime_notes={assetCheck.uptime_notes}
            />
          ))}
      </div>

      <div className={`${detailsOpen ? "" : "hidden"}`}>
        {/* Map status details */}
        <StatusDetails
          sessionToken={sessionToken}
          uptimeCheckId={selectedAssetCheck?.uptime_check_id || ""}
          assetId={selectedAssetCheck?.asset_id || ""}
          statusCheck={selectedAssetCheck?.status_check || ""}
          imageArray={selectedAssetCheck?.images_array || []}
          modifiedBy={selectedAssetCheck?.modified_by || ""}
          modifiedDate={selectedAssetCheck?.modified_date || ""}
          uptimeNotes={selectedAssetCheck?.uptime_notes || ""}
          refreshAssets={() => {
            console.log("refresh assets");
          }}
          closeAsset={() => {
            setDetailsOpen(false);
          }}
        />
      </div>
      <div>
        <AddStatusForm
          addFormOpen={addFormOpen}
          setAddFormOpen={() => setAddFormOpen(false)}
          assetId={assetId || ""}
          onStatusAdded={() => console.log("")}
          assetType={assetType}
          assetTypeId={assetTypeId}
        />
      </div>
    </div>
  );
};

export default AssetStatusChecksPage;
