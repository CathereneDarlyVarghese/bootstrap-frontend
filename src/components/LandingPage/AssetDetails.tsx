import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineCalendar } from "react-icons/ai";
import { toast } from "react-toastify";
import { AssetCondition, StatusTypes } from "enums";
import { IncomingAsset } from "types";
import { deleteAsset, toggleAssetCondition } from "services/assetServices";

import { TfiClose } from "react-icons/tfi";
import AssetDocumentsPage from "components/DocumentsPage/AssetDocumentsPage";
import AssetStatusChecksPage from "components/StatusChecksPage/AssetStatusChecksPage";
import useAssetCondition from "hooks/useAssetCondition";
import { useMutation, useQueryClient } from "react-query";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";

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
}

const AssetDetails: React.FC<AssetDetailsProps> = ({
  assetId,
  cardImage,
  cardTitle,
  assetType,
  sessionToken,
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
}) => {
  // const [, setActiveTab] = useState(0);
  const queryClient = useQueryClient();
  const assetConditions = useAssetCondition();
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");

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

  const deleteAssetMutation = useMutation(
    () => deleteAsset(authTokenObj.authToken, assetId),
    {
      onSettled: () => {
        toast.success("Asset Deleted Successfully");
        queryClient.invalidateQueries(["query-asset"]);
      },
      onError: (err: any) => {
        toast.error("Failed to Delete Document");
      },
    }
  );

  const handleToggleAssetCondition = async () => {
    try {
      const toggledAssetCondition =
        assetCondition === assetConditions[AssetCondition.ACTIVE]
          ? assetConditions[AssetCondition.INACTIVE]
          : assetConditions[AssetCondition.ACTIVE];

      await toggleAssetCondition(sessionToken, assetId, toggledAssetCondition);
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

  return (
    <>
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
                    Section: {sectionName ? sectionName : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Placement: {placementName ? placementName : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Purchase Price:{" "}
                    {parseInt(purchasePrice)
                      ? parseInt(purchasePrice)
                      : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Current Value:{" "}
                    {parseInt(currentValue)
                      ? parseInt(currentValue)
                      : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Notes: {notes ? notes : "Not Available"}
                  </p>
                </div>
                {/* <div className="my-2">
                    <h1 className="text-blue-900 dark:text-white font-semibold my-1">
                      Document:
                    </h1>
                    <div className="flex flex-row items-center gap-2 mt-2">
                      <img src={documentIcon} />
                      <h2 className="font-sans text-gray-500 dark:text-gray-300 text-md md:text-xs">
                        Document Name
                      </h2>
                    </div>
                  </div> */}
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
                <button className="mx-3">
                  <FiEdit3 className="text-xl text-black dark:text-white" />
                </button>
                <button
                  className="mx-3"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this asset?"
                      )
                    ) {
                      deleteAssetMutation.mutate();
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
                selectedAsset={selectedAsset1}
                sessionToken={sessionToken}
                assetId={assetId}
                setAssetId={setAssetId}
                assetType={assetType}
                assetTypeId={assetTypeId}
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
    </>
  );
};

export default AssetDetails;
