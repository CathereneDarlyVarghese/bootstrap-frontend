import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./cardstyles.css";
import AssetCard from "./AssetCard";
import AssetDetails from "./AssetDetails";

import WorkOrderForm from "./WorkOrderForm";
import AddAssetForm from "./AddAssetForm";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import { Asset } from "types";
import { Auth } from "aws-amplify";
import { getInventory } from "services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchIcon from "../../icons/circle2017.png";

const ListsLayout = (props: any) => {
  const [location, setLocation] = useSyncedAtom(locationAtom);
  const [formOpen, setFormOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetId, setAssetId] = useState<Asset["id"]>(null);

  // state from AddAssetForm.tsx
  const [addAssetOpen, setAddAssetOpen] = useState(false);

  //Show submit notification
  const showNotification = () => {
    toast.success("Submitted", { theme: "dark" });
    setFormOpen(false);
  };

  const handleFormopen = () => {
    setFormOpen(true);
  };

  const handleAddAssetOpen = () => {
    setAddAssetOpen(true);
  };

  console.log(location.locationId);

  useEffect(() => {
    // Fetch assets data on location change
    const init = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        console.log(userData);
        const assetsData = await getInventory(
          userData.signInUserSession.accessToken.jwtToken
        );
        console.log(assetsData);
        setAssets(assetsData);
      } catch {
        console.log("Not signed in");
      }
    };
    init();
  }, [location]);

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
        className="w-2/3 h-5/6 mx-10 rounded-xl p-2 overflow-y-auto bg-slate-300 lg:hidden"
        id="style-7"
      >
        {/* Render asset details */}
        {asset ? (
          <AssetDetails
            pendingOrderDetails={asset.workOrders}
            openWorkOrderForm={handleFormopen}
            cardImage={asset.imageS3}
            cardTitle={asset.name}
            badgeText={asset.type}
            DescriptionText={asset.name}
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
      <WorkOrderForm
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        notific={showNotification}
      />
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
