import { useEffect, useState } from "react";
import WorkOrderForm from "./WorkOrderForm1";
import closeIcon from "../../icons/closeIcon.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { AiOutlineCalendar } from "react-icons/ai";
import { toast } from "react-toastify";
import { AssetCondition, StatusTypes } from "enums";
import {
  Asset,
  AssetLocation,
  AssetPlacement,
  AssetSection,
  AssetType,
  IncomingAsset,
  IncomingAssetCheck,
} from "types";
import { deleteAsset, toggleAssetCondition } from "services/assetServices";
import { TfiClose } from "react-icons/tfi";
import AssetDocumentsPage from "components/DocumentsPage/AssetDocumentsPage";
import StatusChecksPage from "components/StatusChecksPage/StatusChecksPage";
import AssetStatusChecksPage from "components/StatusChecksPage/AssetStatusChecksPage";
import { getAssetCheckById } from "services/assetCheckServices";
import useAssetCondition from "hooks/useAssetCondition";
import EditAssetForm from "./EditAssetForm";
import { getAllAssetTypes } from "services/assetTypeServices";
import { getAllAssetLocations } from "services/locationServices";
import { getAssetSections } from "services/assetSectionServices";
import { getAssetPlacements } from "services/assetPlacementServices";

interface AssetDetailsProps {
  sessionToken: string | null;
  assetId: string | null;
  cardTitle: string | null;
  cardImage: string | null;
  sectionName: string | null;
  placementName: string | null;
  purchasePrice: string | null;
  currentValue: string | null;
  notes: string | null;
  assetType: string | null;
  setAssetId: (id: string | null) => void;
  closeAsset: () => void;
  selectedAsset1: IncomingAsset | null;
  tabIndex: any;
  setTabIndex: (tabIndex) => void;
  assetCheckDate: Date | null;
  assetCondition: string | null;
  assetTypeId: string | null;
  assetLocation: any;
}

const AssetDetails: React.FC<
  AssetDetailsProps & { refreshAssets: () => void }
> = ({
  assetId,
  cardImage,
  cardTitle,
  assetType,
  sessionToken,
  refreshAssets,
  setAssetId,
  closeAsset,
  sectionName,
  placementName,
  purchasePrice,
  currentValue,
  notes,
  selectedAsset1,
  tabIndex,
  setTabIndex,
  assetCheckDate,
  assetCondition,
  assetTypeId,
  assetLocation,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>();
  const [assetLocations, setAssetLocations] = useState<AssetLocation[]>();
  const [assetSections, setAssetSections] = useState<AssetSection[]>();
  const [assetPlacements, setAssetPlacements] = useState<AssetPlacement[]>();
  const [assetSection, setAssetSection] = useState<AssetSection>();
  const [assetPlacement, setAssetPlacement] = useState<AssetPlacement>();

  const navigate = useNavigate();
  const location = useLocation();
  const assetConditions = useAssetCondition();

  const getStatusText = (status: string | null) => {
    switch (status) {
      case StatusTypes.WORKING:
        return "WORKING";
      case StatusTypes.DOWN:
        return "DOWN";
      case StatusTypes.MAINTENANCE:
        return "Maintenance";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string | undefined): string => {
    if (status === StatusTypes.WORKING) {
      return "bg-green-400";
    } else if (status === StatusTypes.DOWN) {
      return "bg-red-400";
    } else if (status === StatusTypes.MAINTENANCE) {
      return "bg-yellow-400";
    }
    return "bg-gray-400";
  };

  const handleToggleAssetCondition = async () => {
    try {
      const toggledAssetCondition =
        assetCondition === assetConditions[AssetCondition.ACTIVE]
          ? assetConditions[AssetCondition.INACTIVE]
          : assetConditions[AssetCondition.ACTIVE];

      await toggleAssetCondition(sessionToken, assetId, toggledAssetCondition);
      refreshAssets();
    } catch (error) {
      console.error("Error toggling asset condition:", error);
      toast("Oops, Something went wrong", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // function to add and remove class for UI
  const addClass = (selectClass, addClass) => {
    document.querySelector(selectClass).classList.add(addClass);
  };

  const removeClass = (selectClass, removeClass) => {
    document.querySelector(selectClass).classList.remove(removeClass);
  };

  useEffect(() => {
    const fetchAssetData = async () => {
      const data = window.localStorage.getItem("sessionToken");

      const [
        fetchedAssetTypes,
        fetchedAssetLocations,
        fetchedAssetSections,
        fetchedAssetPlacements,
      ] = await Promise.all([
        getAllAssetTypes(data),
        getAllAssetLocations(data),
        getAssetSections(data),
        getAssetPlacements(data),
      ]);

      setAssetTypes(fetchedAssetTypes);
      setAssetLocations(fetchedAssetLocations);
      setAssetSections(fetchedAssetSections);
      setAssetPlacements(fetchedAssetPlacements);

      // Find the relevant section based on assetSectionName
      const relevantSection = fetchedAssetSections.find(
        (section) => section.section_name === selectedAsset1.section_name
      );

      console.log("Relevant Section => ", relevantSection);

      // Use setAssetSection to update the state with the relevant section
      if (relevantSection) {
        setAssetSection(relevantSection);
      }

      // Find the relevant placement based on assetPlacementName
      const relevantPlacement = fetchedAssetPlacements.find(
        (placement) =>
          placement.placement_name === selectedAsset1.placement_name
      );

      console.log("Relevant Placement => ", relevantPlacement);

      // Use assetPlacementName to update the state with the relevant placement
      if (relevantPlacement) {
        setAssetPlacement(relevantPlacement);
      }
    };

    fetchAssetData();
  }, [location]);

  return (
    <>
      {editFormOpen ? (
        <EditAssetForm
          editFormOpen={editFormOpen}
          setEditFormOpen={setEditFormOpen}
          asset={selectedAsset1}
          assetImage={cardImage}
          assetTypes={assetTypes}
          assetLocations={assetLocations}
          assetLocation={assetLocation}
          assetSections={assetSections}
          assetSection={assetSection}
          assetPlacements={assetPlacements}
          assetPlacement={assetPlacement}
        />
      ) : (
        <div
          className="h-5/6 mx-4 md:mx-0 mt-2 p-5 pt-0 bg-white dark:bg-gray-800 border-blue-900 rounded-xl overflow-y-auto"
          id="style-7"
        >
          <div className="sticky top-0">
            <div className="flex 2xl:flex-row lg:flex-col gap-5 mb-3 mt-5 relative bg-white dark:bg-gray-800">
              <div className="flex flex-col">
                <button
                  className="ml-auto 2xl:hidden lg:block md:my-2"
                  onClick={() => {
                    setAssetId(null);
                  }}
                >
                  {/* <img src={closeIcon} onClick={closeAsset} /> */}
                  <TfiClose
                    className="font-bold text-black dark:text-white"
                    onClick={closeAsset}
                  />
                </button>
                <div className="flex flex-row">
                  <button
                    className={`btn md:btn-sm bg-transparent md:text-xs font-sans px-1 hover:bg-transparent border-2 border-transparent hover:border-transparent rounded-none normal-case  ${
                      tabIndex === 1
                        ? "text-blue-900 dark:text-white border-b-blue-900 dark:border-b-white hover:border-b-blue-900 font-bold"
                        : "text-gray-400 font-normal"
                    }`}
                    onClick={() => {
                      setTabIndex(1);
                    }}
                  >
                    Documents
                  </button>
                  <button
                    className={`btn md:btn-sm bg-transparent md:text-xs font-sans px-1 hover:bg-transparent border-2 border-transparent hover:border-transparent rounded-none normal-case mx-6 md:mx-0 ${
                      tabIndex === 2
                        ? "text-blue-900 dark:text-white border-b-blue-900 dark:border-b-white hover:border-b-blue-900 font-bold"
                        : "text-gray-400 font-normal"
                    }`}
                    onClick={() => {
                      setTabIndex(2);
                    }}
                  >
                    Status Checks
                  </button>
                  <button
                    className={`btn md:btn-sm bg-transparent md:text-xs font-sans px-1 hover:bg-transparent border-2 border-transparent hover:border-transparent rounded-none normal-case ${
                      tabIndex === 3
                        ? "text-blue-900 dark:text-white border-b-blue-900 dark:border-b-white hover:border-b-blue-900 font-bold"
                        : "text-gray-400 font-normal"
                    }`}
                    onClick={() => {
                      setTabIndex(3);
                    }}
                  >
                    Maintenance
                  </button>
                </div>
              </div>

              <button
                className="ml-auto 2xl:block lg:hidden"
                onClick={() => setAssetId(null)}
              >
                <TfiClose
                  onClick={closeAsset}
                  className="font-bold text-black dark:text-white"
                />
              </button>
            </div>
            {tabIndex === 0 ? (
              <>
                <figure className="rounded-none">
                  <img
                    src={cardImage}
                    alt="an image"
                    className="rounded-xl h-48 object-cover mx-auto"
                  />
                </figure>
                <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
                  <div className="flex 2xl:flex-row items-center lg:flex-col">
                    <h2
                      className="flex text-gray-800 dark:text-gray-300 text-xl font-semibold font-sans tracking-wide xl:text-sm"
                      style={{ wordSpacing: 3 }}
                    >
                      {cardTitle}
                    </h2>

                    <div className="my-2 2xl:ml-auto lg:ml-0 lg:mx-auto flex flex-row items-center">
                      <button className="badge w-fit bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-blue-400 font-semibold font-sans cursor-default capitalize border-white border-none mx-1 p-4 text-md xl:text-xs sm:text-[9px] xs:text-[9px] xs:p-2">
                        {assetType}
                      </button>
                      <button
                        className={`badge text-white font-semibold font-sans cursor-default capitalize border-white border-none ml-auto mx-1 p-4 text-md xl:text-xs sm:text-[9px] xs:text-[9px] xs:p-2 ${getStatusColor(
                          selectedAsset1?.asset_status
                        )}`}
                      >
                        {getStatusText(selectedAsset1?.asset_status)}
                      </button>

                      {assetCheckDate ? (
                        <button className="badge bg-green-400 text-white font-semibold font-sans cursor-default capitalize border-white border-none ml-auto mx-1 p-4 text-md xl:text-xs sm:text-[9px] xs:text-[9px] xs:p-2">
                          <AiOutlineCalendar className="mr-3 text-xl sm:mr-1 sm:text-lg" />
                          {assetCheckDate.toLocaleString().slice(0, 10)}
                        </button>
                      ) : (
                        <span className="text-gray-400 mx-1">
                          {/* No status check date available */}
                          Date not available
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-blue-900 dark:text-white font-semibold my-1">
                      More Information:
                    </h1>
                  </div>
                  <div>
                    <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                      Section: {sectionName}
                    </p>
                    <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                      Placement: {placementName}
                    </p>
                    <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                      Purchase Price: {parseInt(purchasePrice)}
                    </p>
                    <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                      Current Value: {parseInt(currentValue)}
                    </p>
                    <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                      Notes: {notes}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row md:justify-center justify-start items-center my-2">
                  <button
                    className="badge w-fit bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-blue-400 font-semibold font-sans cursor-pointer capitalize border-white border-none mx-1 p-4 text-md xl:text-xs sm:text-[9px] xs:text-[9px] xs:p-2"
                    onClick={() => {
                      handleToggleAssetCondition();
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }}
                  >
                    {assetCondition === assetConditions[AssetCondition.ACTIVE]
                      ? "Mark as Inactive"
                      : "Mark as Active"}
                  </button>
                  <button
                    title="Edit Document"
                    onClick={() => {
                      setEditFormOpen(true);
                    }}
                    className="mx-3"
                  >
                    <AiOutlineEdit className="text-2xl text-black dark:text-white" />
                  </button>
                  <button
                    className="mx-3"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this asset?"
                        )
                      ) {
                        console.log("Asset ID ==>> ", assetId);
                        await deleteAsset(sessionToken, assetId)
                          .then(() => {
                            toast("Deleted successfully", {
                              position: "bottom-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                            refreshAssets();
                          })
                          .catch((error) => {
                            console.error("Error deleting inventory:", error);
                            toast("Oops, Something went wrong", {
                              position: "bottom-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          });
                      }
                    }}
                  >
                    <AiOutlineDelete className="text-2xl mx-3 text-black dark:text-white" />
                  </button>
                </div>
              </>
            ) : tabIndex === 1 ? (
              <div>
                <AssetDocumentsPage selectedAsset={selectedAsset1} />
              </div>
            ) : tabIndex === 2 ? (
              <div>
                <AssetStatusChecksPage
                  sessionToken={sessionToken}
                  assetId={assetId}
                  setAssetId={setAssetId}
                  assetType={assetType}
                  assetTypeId={assetTypeId}
                  selectedAsset={selectedAsset1}
                />
              </div>
            ) : (
              <div className="flex flex-row justify-center h-28 items-center">
                <p className="text-black dark:text-gray-300 text-xl font-sans font-semibold">
                  Page Coming Soon
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AssetDetails;
