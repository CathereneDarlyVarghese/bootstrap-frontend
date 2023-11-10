import React, { useState } from 'react';
import { getAssetCheckById } from 'services/assetCheckServices';
import { IncomingAsset, IncomingAssetCheck } from 'types';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { useQuery } from '@tanstack/react-query';
import AddStatusForm from './AddStatusForm';
import StatusDetails from './StatusDetails';
import StatusCard from './StatusCard';

interface AssetStatusChecksPageProps {
  sessionToken: string;
  assetId: string;
  setAssetId: React.Dispatch<React.SetStateAction<string | null>>;
  assetType: string;
  assetTypeId: string;
  selectedAsset: IncomingAsset;
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
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');

  // Helper function to format response

  // Function to handle status card click and show details
  const handleStatusCardClick = (selectedStatusCheckId: string) => {
    setStatusCheckId(selectedStatusCheckId);
    setDetailsOpen(true);

    const selectedCheck = assetChecks.find(
      assetCheck => assetCheck.uptime_check_id === selectedStatusCheckId,
    );
    setSelectedAssetCheck(selectedCheck);
  };

  // Fetching all asset checks using React Query's useQuery
  useQuery({
    queryKey: ['query-assetChecks', assetId, authTokenObj.authToken],
    queryFn: async assetIdObj => {
      const res = await getAssetCheckById(
        authTokenObj.authToken,
        assetIdObj.queryKey[1],
      );
      setAssetChecks(res);
    },
    enabled: !!selectedAsset,
  });

  return (
    <div className="w-full">
      {addFormOpen ? (
        <div>
          <AddStatusForm
            addFormOpen={addFormOpen}
            setAddFormOpen={() => setAddFormOpen(false)}
            assetId={assetId || ''}
            assetType={assetType}
            assetTypeId={assetTypeId}
          />
        </div>
      ) : selectedAsset.status_check_enabled === true ? (
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
            <h1 className="text-blue-800 text-sm italic">
              *Click on the card for more info
            </h1>
          </div>
          <div className={`${detailsOpen ? 'hidden' : ''}`}>
            {assetChecks
              .sort(
                (a, b) =>
                  new Date(b.modified_date).getTime() -
                  new Date(a.modified_date).getTime(),
              )
              .map(assetCheck => (
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
      ) : (
        <div className="flex flex-row justify-center">
          <h1 className="font-sans font-semibold mt-10 text-center">
            Status Checks disabled. Edit asset to enable status checks
          </h1>
        </div>
      )}

      <div className={`${detailsOpen ? '' : 'hidden'}`}>
        {/* Map status details */}
        <StatusDetails
          selectedAssetCheck={selectedAssetCheck || undefined}
          closeAsset={() => {
            setDetailsOpen(false);
          }}
          status_check_data={selectedAssetCheck?.status_check_data}
        />
      </div>
    </div>
  );
};

export default AssetStatusChecksPage;
