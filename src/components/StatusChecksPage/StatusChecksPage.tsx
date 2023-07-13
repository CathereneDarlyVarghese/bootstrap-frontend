import { useState } from "react";
import { IncomingAssetCheck } from "../../types";
import "react-toastify/dist/ReactToastify.css";

const StatusChecksPage = () => {
  const [assetId, setAssetId] = useState<string | null>(null);
  const [statusCheckId, setStatusCheckId] = useState<string | null>(null);
  const [assetChecks, setAssetChecks] = useState<IncomingAssetCheck[]>([]);
  const [selectedAssetCheck, setSelectedAssetCheck] =
    useState<IncomingAssetCheck>();


  const refreshAssets = () => {
    setAssetId(null);
    // Toggle the assetId state to trigger refresh
  };

  const handleStatusCardClick = (selectedStatusCheckId: string) => {
    setStatusCheckId(selectedStatusCheckId);
    const selectedAssetCheck = assetChecks.find(
      (assetCheck) => assetCheck.uptime_check_id === selectedStatusCheckId
    );
    setSelectedAssetCheck(selectedAssetCheck);
    console.log("Selected Status CHeck==>>", selectedAssetCheck);
  };

  return (
    // temporary message
    <div className="flex flex-row justify-center h-screen items-center bg-white dark:bg-black">
      <h1 className="text-black dark:text-gray-300 text-3xl font-sans font-semibold mb-10">Page Coming Soon</h1>
    </div>


  );
};

export default StatusChecksPage;
