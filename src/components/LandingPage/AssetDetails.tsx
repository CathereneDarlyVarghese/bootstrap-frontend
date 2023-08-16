import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineCalendar } from "react-icons/ai";
import { toast } from "react-toastify";
import { AssetCondition, StatusTypes } from "enums";
import { Asset, IncomingAsset } from "types";
import { deleteAsset, toggleAssetCondition } from "services/assetServices";

import { TfiClose } from "react-icons/tfi";
import AssetDocumentsPage from "components/DocumentsPage/AssetDocumentsPage";
import AssetStatusChecksPage from "components/StatusChecksPage/AssetStatusChecksPage";
import useAssetCondition from "hooks/useAssetCondition";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import {
  getStatusColor,
  getStatusText,
} from "components/StatusChecksPage/statusUtils";

interface AssetDetailsProps {
  sessionToken: string | null;
  setAssetId: (id: string | null) => void;
  closeAsset: () => void;
  Asset: IncomingAsset | null;
  tabIndex: any;
  setTabIndex: (tabIndex) => void;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({
  sessionToken,
  setAssetId,
  closeAsset,
  Asset,
  tabIndex,
  setTabIndex,
}) => {
  // State and Hooks
  const queryClient = useQueryClient();
  const assetConditions = useAssetCondition();
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [assetConditionState, setAssetConditionState] = useState(assetConditions[AssetCondition.ACTIVE])

  // Mutation for deleting an asset
  const deleteAssetMutation = useMutation({
    mutationFn: () => deleteAsset(authTokenObj.authToken, Asset.asset_id),
    onSettled: () => {
      setAssetId(null);
      toast.info("Asset Deleted Successfully");
      queryClient.invalidateQueries(["query-asset"]);
    },
    onError: (err: any) => {
      toast.error("Failed to Delete Asset");
    },
  });

  // Mutation for toggling asset condition
  const handleToggleAssetCondition = useMutation({
    mutationFn: (assetCondition: string) => {
      if (assetCondition === assetConditions[AssetCondition.ACTIVE]) {
        return toggleAssetCondition(
          authTokenObj.authToken,
          Asset.asset_id,
          assetConditions[AssetCondition.INACTIVE]
        );
      } else {
        return toggleAssetCondition(
          authTokenObj.authToken,
          Asset.asset_id,
          assetConditions[AssetCondition.ACTIVE]
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["query-asset"]);
    },
    onError: (err: any) => {
      toast.error("Failed to toggle asset condition");
    },
  });

  // const [, setActiveTab] = useState(0);

  // const handleToggleAssetCondition = async () => {
  //   try {
  //     const toggledAssetCondition =
  //       assetCondition === assetConditions[AssetCondition.ACTIVE]
  //         ? assetConditions[AssetCondition.INACTIVE]
  //         : assetConditions[AssetCondition.ACTIVE];

  //     await toggleAssetCondition(
  //       authTokenObj.authToken,
  //       assetId,
  //       toggledAssetCondition
  //     );
  //   } catch (error) {
  //     console.error("Error toggling asset condition:", error);
  //     toast("Oops, Something went wrong");
  //   }
  // };

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
                  className={`btn md:btn-sm bg-transparent md:text-xs font-sans px-1 hover:bg-transparent border-2 border-transparent hover:border-transparent rounded-none normal-case  ${tabIndex === 1
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
                  className={`btn md:btn-sm bg-transparent md:text-xs font-sans px-1 hover:bg-transparent border-2 border-transparent hover:border-transparent rounded-none normal-case mx-6 md:mx-0 ${tabIndex === 2
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
                  className={`btn md:btn-sm bg-transparent md:text-xs font-sans px-1 hover:bg-transparent border-2 border-transparent hover:border-transparent rounded-none normal-case ${tabIndex === 3
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
                  src={Asset.images_array[0]}
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
                    {Asset.asset_name}
                  </h2>

                  <div className="my-2 2xl:ml-auto lg:ml-0 lg:mx-auto flex flex-row items-center">
                    <button className="badge w-fit bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-blue-400 font-semibold font-sans cursor-default capitalize border-white border-none mx-1 p-4 text-md xl:text-xs sm:text-[9px] xs:text-[9px] xs:p-2">
                      {Asset.asset_type}
                    </button>
                    <button
                      className={`badge text-white font-semibold font-sans cursor-default capitalize border-white border-none ml-auto mx-1 p-4 text-md xl:text-xs sm:text-[9px] xs:text-[9px] xs:p-2 ${getStatusColor(
                        Asset.asset_status
                      )}`}
                    >
                      {getStatusText(Asset?.asset_status)}
                    </button>

                    {Asset.next_asset_check_date ? (
                      <button className="badge bg-green-400 text-white font-semibold font-sans cursor-default capitalize border-white border-none ml-auto mx-1 p-4 text-md xl:text-xs sm:text-[9px] xs:text-[9px] xs:p-2">
                        <AiOutlineCalendar className="mr-3 text-xl sm:mr-1 sm:text-lg" />
                        {Asset.next_asset_check_date
                          .toLocaleString()
                          .slice(0, 10)}
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
                    Section:{" "}
                    {Asset.section_name ? Asset.section_name : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Placement:{" "}
                    {Asset.placement_name
                      ? Asset.placement_name
                      : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Purchase Price:{" "}
                    {parseInt(Asset.asset_finance_purchase)
                      ? parseInt(Asset.asset_finance_purchase)
                      : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Current Value:{" "}
                    {parseInt(Asset.asset_finance_current_value)
                      ? parseInt(Asset.asset_finance_current_value)
                      : "Not Available"}
                  </p>
                  <p className="text-black dark:text-gray-300 font-sans my-1 text-sm">
                    Notes:{" "}
                    {Asset.asset_notes ? Asset.asset_notes : "Not Available"}
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
                    handleToggleAssetCondition.mutate(Asset.asset_condition);
                    closeAsset()
                    // setTimeout(() => {
                    //   window.location.reload();
                    // }, 1000);
                  }}
                >
                  {Asset.asset_condition ===
                    assetConditions[AssetCondition.ACTIVE]
                    ? "Mark as Inactive"
                    : "Mark as Active"}
                  {/* {assetConditionState === assetConditions[AssetCondition.ACTIVE] ? "Mark as Inactive" : "Mark as Active"} */}
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
              <AssetDocumentsPage selectedAsset={Asset} />
            </div>
          ) : tabIndex === 2 ? (
            <div>
              <AssetStatusChecksPage
                selectedAsset={Asset}
                sessionToken={sessionToken}
                assetId={Asset.asset_id}
                setAssetId={setAssetId}
                assetType={Asset.asset_type}
                assetTypeId={Asset.asset_type_id}
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
