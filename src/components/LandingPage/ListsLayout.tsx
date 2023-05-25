import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./cardstyles.css";
import AssetCard from "./AssetCard";
import AssetDetails from "./AssetDetails";

import AddAssetForm from "./AddAssetForm";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import { Asset } from "types";
import { Auth } from "aws-amplify";
import { getInventory } from "services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkOrderForm from "./WorkOrderForm1";

import SearchIcon from "../../icons/circle2017.png";

const ListsLayout = (props: any) => {
  const [location, setLocation] = useSyncedAtom(locationAtom);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetId, setAssetId] = useState<Asset["id"]>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);

  // state from AddAssetForm.tsx
  const [addAssetOpen, setAddAssetOpen] = useState(false);

  // Used just for passing props to WorkOrderForm.tsx WITHOUT HAVING TO RENDER IT
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);

  const handleAddWorkOrder = () => {
    setShowWorkOrderForm(true);
  };

  const handleAddAssetOpen = () => {
    setAddAssetOpen(true);
  };

  const refreshAssets = () => {
    setForceRefresh((prev) => !prev); // Toggle the forceRefresh state to trigger refresh
  };

  useEffect(() => {
    // Fetch assets data on location change
    const init = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.accessToken.jwtToken);
        console.log("User Data: ", userData);
        const assetsData = await getInventory(
          userData.signInUserSession.accessToken.jwtToken
        );
        console.log("Sessions Token ==>>", sessionToken);
        setAssets(assetsData);
      } catch {
        console.log("Not signed in");
      }
    };
    init();
  }, [location, forceRefresh]);

  // Filter assets based on current location
  const filteredAssets = useMemo(
    () => assets.filter((a) => a.location === location.locationId),
    [assets, location]
  );

  // Get the selected asset based on assetId
  const asset = useMemo(
    () => assets.find((a) => a.id === assetId),
    [assetId, location]
  );

  return (
    <div
      className="bg-primary-content h-full"
      style={{ display: "flex", flexDirection: "row" }}
    >
      {/* Removed comments above the ToastContainer */}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
      />
      <div
        className="w-1/3 h-5/6 rounded-xl p-2 overflow-y-auto lg:w-full"
        id="style-7"
      >
        <div
          style={{ display: "flex", flexDirection: "row" }}
          className="items-center justify-center"
        >
          {/* Search input field */}
          <div className="flex flex-row items-center bg-gray-100 rounded-xl w-full">
            <button>
              <img
                src={SearchIcon}
                className="h-fit justify-center items-center ml-3"
              />
            </button>

            <input
              type="text"
              // placeholder={"Search " + props.searchType}
              placeholder="Search Appliance"
              className="w-4/5 h-12 p-5 bg-gray-100 placeholder-blue-700 text-blue-700 text-sm border-none font-sans"
            />
          </div>

          {/* Add asset button */}
          <button
            className="btn w-28 h-fit ml-3 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none"
            onClick={handleAddAssetOpen}
          >
            {/* {"+ Add " + props.searchType} */}+ Add
          </button>
        </div>
        {/* Render filtered asset cards */}
        {filteredAssets.map((a) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setAssetId(a.id);
            }}
          >
            <AssetCard
              assetName={a.name}
              assetType={a.type}
              assetAddress={a.location}
              imageLocation={a.imageS3}
            />
          </div>
        ))}
      </div>
      <div
        className="w-2/3 h-6/6 p-2 overflow-y-auto bg-gray-200 lg:hidden"
        id="style-7"
      >
        {/* Render asset details */}
        {asset ? (
          <AssetDetails
            assetId={assetId}
            pendingOrderDetails={asset.workOrders}
            cardImage={asset.imageS3}
            cardTitle={asset.name}
            assetType={asset.type}
            DescriptionText={asset.name}
            sessionToken={sessionToken}
            refreshAssets={refreshAssets}
            setAssetId={setAssetId}
          />
        ) : (
          <div className="flex items-center h-fit my-52 mx-auto justify-center">
            <h1 className="font-bold text-3xl text-slate-400">
              Choose an Asset
            </h1>
          </div>
        )}
      </div>

      {/* Render work order form */}
      {/* <WorkOrderForm /> */}
      {showWorkOrderForm ? <WorkOrderForm assetId={assetId} /> : ""}
      {/* Render add asset form */}
      <AddAssetForm
        addAssetOpen={addAssetOpen}
        setAddAssetOpen={setAddAssetOpen}
      />
    </div>
  );
};

ListsLayout.propTypes = {
  searchType: PropTypes.string,
};

ListsLayout.defaultProps = {
  searchType: "Item",
};

export default ListsLayout;
