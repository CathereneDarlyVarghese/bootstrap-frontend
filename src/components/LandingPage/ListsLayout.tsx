import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./cardstyles.css";
import AssetCard from "./AssetCard";
import AssetDetails from "./AssetDetails";

import AddAssetForm from "./AddAssetForm";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import { Asset, IncomingAsset } from "types";
import { Auth } from "aws-amplify";
import { getInventory } from "services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkOrderForm from "./WorkOrderForm1";

import SearchIcon from "../../icons/circle2017.png";

//sample image for ui testing
import testImage from "./testImage.png";
import { getAllAssets } from "services/assetServices";

const ListsLayout = (props: any) => {
  const [location, setLocation] = useSyncedAtom(locationAtom);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [incomingAssets, setIncomingAssets] = useState<IncomingAsset[]>([]); //This is because the fetched assets are a mixture from several tables.
  const [assetId, setAssetId] = useState(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filteredAssets, setFilteredAssets] = useState<IncomingAsset[]>([]);

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
    setForceRefresh((prev) => !prev);
    // setAssetId(null);
    // Toggle the forceRefresh state to trigger refresh
  };

  // function to remove class for UI
  const removeClass = (selectClass, removeClass) => {
    document.querySelector(selectClass).classList.remove(removeClass);
  };
  //function to add class for UI
  const addClass = (selectClass, addClass) => {
    document.querySelector(selectClass).classList.add(addClass);
  };

  const filterAssets = (searchTerm: string) => {
    const filtered = incomingAssets.filter(
      (asset) =>
        asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.asset_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssets(filtered);
  };

  // useEffect(() => {
  //   // Fetch assets data on location change
  //   const init = async () => {
  //     try {
  //       const userData = await Auth.currentAuthenticatedUser();
  //       setSessionToken(userData.signInUserSession.accessToken.jwtToken);
  //       console.log("User Data: ", userData);
  //       const assetsData = await getInventory(
  //         userData.signInUserSession.accessToken.jwtToken
  //       );
  //       console.log("Sessions Token ==>>", sessionToken);
  //       setAssets(assetsData);
  //     } catch {
  //       console.log("Not signed in");
  //     }
  //   };
  //   init();
  // }, [location, forceRefresh]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.accessToken.jwtToken);
        const assetsData = await getAllAssets(
          userData.signInUserSession.accessToken.jwtToken
        );
        setIncomingAssets(assetsData);
        console.log("The fetched assets ==>>", assetsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssets();
  }, []);

  // Filter assets based on current location
  // const filteredAssets = useMemo(
  //   () => assets.filter((a) => a.location === location.locationId),
  //   [assets, location]
  // );

  // Get the selected asset based on assetId
  // const asset = useMemo(
  //   () => assets.find((a) => a.id === assetId),
  //   [assetId, location]
  // );

  return (
    <div
      className="bg-primary-content h-full"
      style={{ display: "flex", flexDirection: "row" }}
      id="parent-element"
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
        className="w-1/3 h-5/6 rounded-xl p-2 overflow-y-auto lg:w-full asset-card"
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
              placeholder="Search Appliance"
              className="w-4/5 h-12 p-5 bg-gray-100 placeholder-blue-700 text-blue-700 text-sm border-none font-sans"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add asset button */}
          <button
            className="btn w-28 h-fit ml-3 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none"
            onClick={handleAddAssetOpen}
          >
            + Add
          </button>
        </div>
        {/* Render filtered asset cards */}
        {/* {filteredAssets
          .filter(
            (a) =>
              a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.type.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((a) => (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                setAssetId(a.id);
                removeClass("#parent-element .asset-details-card", "lg:hidden");
                addClass("#parent-element .asset-details-card", "lg:w-full");
                addClass("#parent-element .asset-card", "lg:hidden");
              }}
            >
              <AssetCard
                assetName={a.name}
                assetType={a.type}
                assetAddress={a.location}
                imageLocation={a.imageS3}
                imagePlaceholder="img"
                status={a.type}
              />
            </div>
          ))} */}

        {/* Temporary Asset Details */}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeClass("#parent-element .asset-details-card", "lg:hidden");
            addClass("#parent-element .asset-details-card", "lg:w-full");
            addClass("#parent-element .asset-card", "lg:hidden");
          }}
        >
          {/* Render asset cards */}
          {incomingAssets.map((asset) => (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedAsset(asset);
                setAssetId(asset.asset_id);
                removeClass("#parent-element .asset-details-card", "lg:hidden");
                addClass("#parent-element .asset-details-card", "lg:w-full");
                addClass("#parent-element .asset-card", "lg:hidden");
              }}
            >
              <AssetCard
                assetName={asset.asset_name}
                assetType={asset.asset_type}
                assetAddress={asset.location_name}
                imageLocation={asset.images_array[0]} // Replace `imageLocation` with the correct property name from the `Asset` type
                status={asset.asset_status} // Replace `asset_status` with the correct property name from the `Asset` type
                imagePlaceholder="img" // Add the appropriate image placeholder value
              />
            </div>
          ))}
        </div>
        {/* <div style={{ cursor: "pointer" }}>
          <AssetCard
            assetName="Test Asset2"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="valid"
          />
        </div>
        <div style={{ cursor: "pointer" }}>
          <AssetCard
            assetName="Test Asset3"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="expired"
          />
        </div>
        <div style={{ cursor: "pointer" }}>
          <AssetCard
            assetName="Test Asset4"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="valid"
          />
        </div>
        <div style={{ cursor: "pointer" }}>
          <AssetCard
            assetName="Test Asset5"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="valid"
          />
        </div> */}

        {/* Temporary Asset Details */}
      </div>
      <div
        className="w-2/3 h-6/6 p-2 overflow-y-auto bg-gray-200 lg:hidden asset-details-card"
        id="style-7"
      >
        {/* Render asset details */}
        {/* {
          asset ? (
            <AssetDetails
              closeAsset={() => {
                removeClass("#parent-element .asset-details-card", "lg:hidden");
                addClass("#parent-element .asset-details-card", "w-full");
                addClass("#parent-element .asset-card", "lg:hidden");
              }}
              assetId={assetId}
              // pendingOrderDetails={asset.workOrders}
              cardImage={asset.imageS3}
              cardTitle={asset.name}
              assetType={asset.type}
              DescriptionText={asset.name}
              sessionToken={sessionToken}
              refreshAssets={refreshAssets}
              setAssetId={setAssetId}
            />
          )
          : (
            <div className="flex items-center h-fit my-52 mx-auto justify-center">
              <h1 className="font-bold text-3xl text-slate-400">
                Choose an Asset
              </h1>
            </div>
          )
        } */}

        {selectedAsset ? (
          <AssetDetails
            closeAsset={() => {
              addClass("#parent-element .asset-details-card", "lg:hidden");
              removeClass("#parent-element .asset-details-card", "w-full");
              removeClass("#parent-element .asset-card", "lg:hidden");
            }}
            assetId={selectedAsset.asset_id}
            cardImage={selectedAsset.images_array[0]}
            cardTitle={selectedAsset.asset_name}
            assetType={selectedAsset.asset_type}
            notes={selectedAsset.asset_notes}
            sectionName={selectedAsset.section_name}
            placementName={selectedAsset.placement_name}
            purchasePrice={selectedAsset.asset_finance_purchase}
            currentValue={selectedAsset.asset_finance_current_value}
            sessionToken={sessionToken}
            refreshAssets={refreshAssets}
            setAssetId={setSelectedAsset}
            selectedAsset1={selectedAsset}
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
      {/* {showWorkOrderForm ? (
        <WorkOrderForm
          assetId1={assetId}
          closeModal={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      ) : (
        ""
      )} */}
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
