import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { getAssetCheckById } from "services/assetCheckServices";
import StatusCard from "./StatusCard";
import StatusDetails from "./StatusDetails";
import AddStatusForm from "./AddStatusForm";
import SearchIcon from "../../icons/circle2017.png";
import testImage from "../LandingPage/testImage.png";
import { AssetCheck, IncomingAssetCheck } from "../../types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StatusChecksPage = () => {
  const [assetId, setAssetId] = useState<string | null>(null);
  const [statusCheckId, setStatusCheckId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [assetChecks, setAssetChecks] = useState<IncomingAssetCheck[]>([]);
  const [selectedAssetCheck, setSelectedAssetCheck] =
    useState<IncomingAssetCheck>();
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  // const assetId1 = location.state.assetId;
  // console.log("asset id in status check ==>>", assetId1);

  const refreshAssets = () => {
    setAssetId(null);
    // Toggle the assetId state to trigger refresh
  };

  // const handleStatusAdded = async () => {
  //   try {
  //     const userData = await Auth.currentAuthenticatedUser();
  //     const response = await getAssetCheckById(
  //       userData.signInUserSession.accessToken.jwtToken,
  //       assetId1
  //     );
  //     setAssetChecks(response);
  //     console.log("status Checks Fetched ==>>", response);
  //   } catch (error) {
  //     console.log("Error fetching asset checks:", error);
  //   }
  // };

  const handleStatusCardClick = (selectedStatusCheckId: string) => {
    setStatusCheckId(selectedStatusCheckId);
    const selectedAssetCheck = assetChecks.find(
      (assetCheck) => assetCheck.uptime_check_id === selectedStatusCheckId
    );
    setSelectedAssetCheck(selectedAssetCheck);
    console.log("Selected Status CHeck==>>", selectedAssetCheck);
  };

  // useEffect(() => {
  //   const fetchAssetChecks = async () => {
  //     try {
  //       const userData = await Auth.currentAuthenticatedUser();
  //       setSessionToken(userData.signInUserSession.accessToken.jwtToken);
  //       const response = await getAssetCheckById(
  //         userData.signInUserSession.accessToken.jwtToken,
  //         assetId1
  //       );
  //       setAssetChecks(response);
  //       console.log("status Checks Fetched ==>>", response);
  //     } catch (error) {
  //       console.log("Error fetching asset checks:", error);
  //     }
  //   };

  //   fetchAssetChecks();
  // }, [assetId1]);

  return (
    // temporary message
    <div className="flex flex-row justify-center h-screen items-center bg-white dark:bg-black">
      <h1 className="text-black dark:text-gray-300 text-3xl font-sans font-semibold mb-10">Page Coming Soon</h1>
    </div>

    // <div className="bg-primary-content h-full flex flex-row">
    //   <ToastContainer
    //     position="bottom-left"
    //     autoClose={5000}
    //     hideProgressBar={true}
    //     newestOnTop={false}
    //     closeOnClick
    //   />
    //   <div className="w-1/3 h-5/6 rounded-xl p-2 overflow-y-auto lg:w-full asset-card">
    //     <div className="flex items-center justify-center">
    //       <div className="flex flex-row items-center bg-gray-100 rounded-xl w-full">
    //         <button>
    //           <img
    //             src={SearchIcon}
    //             className="h-fit justify-center items-center ml-3"
    //           />
    //         </button>
    //         <input
    //           type="text"
    //           placeholder="Search Audits"
    //           className="w-4/5 h-12 p-5 bg-gray-100 placeholder-blue-700 text-blue-700 text-sm border-none font-sans"
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //         />
    //       </div>
    //       <button
    //         className="btn w-28 h-fit ml-3 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none"
    //         onClick={() => setAddFormOpen(true)}
    //       >
    //         + Add
    //       </button>
    //     </div>
    //     {assetChecks.map((assetCheck) => (
    //       <StatusCard
    //         status={assetCheck.status_check}
    //         date={new Date(assetCheck.modified_date)}
    //         onClick={() => handleStatusCardClick(assetCheck.uptime_check_id)}
    //         uptime_notes={assetCheck.uptime_notes}
    //       />
    //     ))}
    //   </div>
    //   <div className="w-2/3 h-6/6 p-2 overflow-y-auto bg-gray-200 lg:hidden asset-details-card">
    //     <StatusDetails
    //       sessionToken={sessionToken}
    //       uptimeCheckId={selectedAssetCheck?.uptime_check_id || ""}
    //       assetId={selectedAssetCheck?.asset_id || ""}
    //       statusCheck={selectedAssetCheck?.status_check || ""}
    //       imageArray={selectedAssetCheck?.images_array || []}
    //       modifiedBy={selectedAssetCheck?.modified_by || ""}
    //       modifiedDate={selectedAssetCheck?.modified_date || ""}
    //       uptimeNotes={selectedAssetCheck?.uptime_notes || ""}
    //       refreshAssets={refreshAssets}
    //       closeAsset={() => setSelectedAssetCheck(undefined)}
    //     />
    //   </div>
    //   <AddStatusForm
    //     addFormOpen={addFormOpen}
    //     setAddFormOpen={setAddFormOpen}
    //     assetId={assetId1}
    //     onStatusAdded={handleStatusAdded}
    //   />
    // </div>
  );
};

export default StatusChecksPage;
