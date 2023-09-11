import React, { useEffect, useState } from "react";
import StatusCard from "./StatusCard";
import StatusDetails from "./StatusDetails";
import AddStatusForm from "./AddStatusForm";
import { getAssetCheckById } from "services/assetCheckServices";
import { IncomingAsset, IncomingAssetCheck } from "types";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useQuery } from "@tanstack/react-query";

interface AssetStatusChecksPageProps {
  sessionToken: string;
  assetId: string;
  setAssetId: React.Dispatch<React.SetStateAction<string | null>>;
  assetType: string;
  assetTypeId: string;
  selectedAsset: any;
}

const AssetStatusChecksPage: React.FC<AssetStatusChecksPageProps> = ({
  sessionToken,
  assetId,
  setAssetId,
  assetType,
  assetTypeId,
  selectedAsset,
}) => {
  // State Initialization
  const [assetChecks, setAssetChecks] = useState<IncomingAssetCheck[]>([]);
  const [selectedAssetCheck, setSelectedAssetCheck] =
    useState<IncomingAssetCheck>();
  const [, setStatusCheckId] = useState<string | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [getResult, setGetResult] = useState<string | null>(null);
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");


  // Helper function to format response
  const formatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };

  // Function to handle status card click and show details
  const handleStatusCardClick = (selectedStatusCheckId: string) => {
    setStatusCheckId(selectedStatusCheckId);
    setDetailsOpen(true);

    const selectedCheck = assetChecks.find(
      (assetCheck) => assetCheck.uptime_check_id === selectedStatusCheckId
    );
    setSelectedAssetCheck(selectedCheck);
  };

  // Async function to fetch all asset checks based on assetId
  const fetchAllAssetChecks = async (assetId) => {
    try {
      const res = await getAssetCheckById(
        authTokenObj.authToken,
        assetId.queryKey[1]
      );
      setAssetChecks(res);
    } catch (error) {
      setGetResult(formatResponse(error.response?.data || error));
    }
  };

  // Fetching all asset checks using React Query's useQuery
  const { data: AllAssetChecks } = useQuery({
    queryKey: ["query-assetChecks", assetId, authTokenObj.authToken],
    queryFn: fetchAllAssetChecks,
    enabled: !!selectedAsset, // only enabled if there's a selectedAsset
  });


  return (
    <div className="w-full">
      {addFormOpen ? (
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
      ) : (
        selectedAsset.status_check_enabled === true ?
          (<div>
            <div className="flex flex-row items-center">
              <h1 className="text-blue-900 dark:text-blue-600 text-lg md:text-sm font-sans font-semibold">
                Status Checks - {selectedAsset.asset_name}
              </h1>
              <button
                className="btn bg-blue-900 ml-auto"
                onClick={() => setAddFormOpen(true)}
              >
                +Add
              </button>
            </div>
            <div>
              <h1 className="text-blue-800 text-sm italic">*Click on the card for more info</h1>
            </div>
            <div className={`${detailsOpen ? "hidden" : ""}`}>

              {
                assetChecks.sort((a, b) =>
                  new Date(b.modified_date).getTime() -
                  new Date(a.modified_date).getTime()
                )
                  .map((assetCheck) => (
                    <StatusCard
                      status={assetCheck.status_check}
                      date={new Date(assetCheck.modified_date)}
                      onClick={() =>
                        handleStatusCardClick(assetCheck.uptime_check_id)
                      }
                      uptime_notes={assetCheck.uptime_notes}
                    />
                  ))}
            </div>
          </div>)
          : (
            <div className="flex flex-row justify-center">
              <h1 className="font-sans font-semibold mt-10 text-center">Status Checks disabled. Edit asset to enable status checks</h1>
            </div>
          )
      )}

      <div className={`${detailsOpen ? "" : "hidden"}`}>
        {/* Map status details */}
        <StatusDetails
          selectedAssetCheck={selectedAssetCheck || undefined}
          closeAsset={() => {
            setDetailsOpen(false);
          }}
          status_check_data={selectedAssetCheck?.status_check_data}
        />
      </div>
      {/* <div>
        <AddStatusForm
          addFormOpen={addFormOpen}
          setAddFormOpen={() => setAddFormOpen(false)}
          assetId={assetId || ""}
          onStatusAdded={() => console.log("")}
          assetType={assetType}
          assetTypeId={assetTypeId}
        />
      </div> */}
    </div>
  );
};

export default AssetStatusChecksPage;
