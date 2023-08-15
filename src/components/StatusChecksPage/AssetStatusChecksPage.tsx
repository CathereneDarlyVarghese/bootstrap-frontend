import React, { useEffect, useState } from "react";
import StatusCard from "./StatusCard";
import StatusDetails from "./StatusDetails";
import AddStatusForm from "./AddStatusForm";
import { getAssetCheckById } from "services/assetCheckServices";
import { IncomingAssetCheck } from "types";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useQuery } from "react-query";

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
  const [, setStatusCheckId] = useState<string | null>(null);
  const [assetChecks, setAssetChecks] = useState<IncomingAssetCheck[]>([]);
  const [selectedAssetCheck, setSelectedAssetCheck] =
    useState<IncomingAssetCheck>();
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [getResult, setGetResult] = useState<string | null>(null);
  const formatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };
  const handleStatusCardClick = (selectedStatusCheckId: string) => {
    setStatusCheckId(selectedStatusCheckId);
    setDetailsOpen(true);
    const selectedAssetCheck = assetChecks.find(
      (assetCheck) => assetCheck.uptime_check_id === selectedStatusCheckId
    );
    setSelectedAssetCheck(selectedAssetCheck);
  };

  const { refetch: getAllAssetChecks } = useQuery<IncomingAssetCheck[], Error>(
    "query-assetChecks",
    async () => {
      return await getAssetCheckById(authTokenObj.authToken, assetId);
    },
    {
      enabled: true,
      onSuccess: (res) => {
        setAssetChecks(res);
      },
      onError: (err: any) => {
        setGetResult(formatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    getAllAssetChecks();
  }, [assetId, authTokenObj.authToken]);

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
        <div>
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
                  onClick={() =>
                    handleStatusCardClick(assetCheck.uptime_check_id)
                  }
                  uptime_notes={assetCheck.uptime_notes}
                />
              ))}
          </div>
        </div>
      )}

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
