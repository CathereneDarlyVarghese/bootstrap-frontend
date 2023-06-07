import React from "react";
import AssetCard from "../LandingPage/AssetCard";
import StatusCard from "./StatusCard";
import StatusDetails from "./StatusDetails";
import AssetDetails from "../LandingPage/AssetDetails";
import { Asset } from "types";
import { Auth } from "aws-amplify";
import { getInventory } from "services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import AddStatusForm from "./AddStatusForm";
import "../LandingPage/cardstyles.css";

import SearchIcon from "../../icons/circle2017.png";

//sample image for ui testing
import testImage from "../LandingPage/testImage.png";

const StatusChecksPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetId, setAssetId] = useState<Asset["asset_id"]>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // state from AddAssetForm.tsx
  const [addFormOpen, setAddFormOpen] = useState(false);

  // Used just for passing props to WorkOrderForm.tsx WITHOUT HAVING TO RENDER IT

  const handleAddAssetOpen = () => {
    setAddFormOpen(true);
  };

  const refreshAssets = () => {
    setForceRefresh((prev) => !prev);
    setAssetId(null);
    // Toggle the forceRefresh state to trigger refresh
  };

  //function to add and remove class for UI
  const addClass = (selectClass, addClass) => {
    document.querySelector(selectClass).classList.add(addClass);
  };
  const removeClass = (selectClass, removeClass) => {
    document.querySelector(selectClass).classList.remove(removeClass);
  };

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
              placeholder="Search Audits"
              className="w-4/5 h-12 p-5 bg-gray-100 placeholder-blue-700 text-blue-700 text-sm border-none font-sans"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="btn w-28 h-fit ml-3 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none"
            onClick={() => setAddFormOpen(true)}
          >
            + Add
          </button>
        </div>

        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeClass("#parent-element .asset-details-card", "lg:hidden");
            addClass("#parent-element .asset-details-card", "lg:w-full");
            addClass("#parent-element .asset-card", "lg:hidden");
          }}
        >
          <StatusCard
            assetName="Fourth Audit"
            assetType="Appliances"
            assetAddress="tsd"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="expire_soon"
          />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeClass("#parent-element .asset-details-card", "lg:hidden");
            addClass("#parent-element .asset-details-card", "lg:w-full");
            addClass("#parent-element .asset-card", "lg:hidden");
          }}
        >
          <StatusCard
            assetName="Third Audit"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="valid"
          />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeClass("#parent-element .asset-details-card", "lg:hidden");
            addClass("#parent-element .asset-details-card", "lg:w-full");
            addClass("#parent-element .asset-card", "lg:hidden");
          }}
        >
          <StatusCard
            assetName="Second Audit"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="expired"
          />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeClass("#parent-element .asset-details-card", "lg:hidden");
            addClass("#parent-element .asset-details-card", "lg:w-full");
            addClass("#parent-element .asset-card", "lg:hidden");
          }}
        >
          <StatusCard
            assetName="First Audit"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="valid"
          />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeClass("#parent-element .asset-details-card", "lg:hidden");
            addClass("#parent-element .asset-details-card", "lg:w-full");
            addClass("#parent-element .asset-card", "lg:hidden");
          }}
        >
          <StatusCard
            assetName="Test Asset5"
            assetType="Appliances"
            assetAddress="The Spiffy Dapper"
            imageLocation={testImage}
            imagePlaceholder="img"
            status="valid"
          />
        </div>
      </div>
      <div
        className="w-2/3 h-6/6 p-2 overflow-y-auto bg-gray-200 lg:hidden asset-details-card"
        id="style-7"
      >
        <StatusDetails
          closeAsset={() => {
            addClass("#parent-element .asset-details-card", "lg:hidden");
            removeClass("#parent-element .asset-details-card", "w-full");
            removeClass("#parent-element .asset-card", "lg:hidden");
          }}
          assetId="1234"
          // pendingOrderDetails={asset.workOrders}
          cardImage={testImage}
          cardTitle="Status Check Details"
          assetType="Appliances"
          DescriptionText="Description of Asset"
          sessionToken={sessionToken}
          refreshAssets={refreshAssets}
          setAssetId={setAssetId}
        />
      </div>
      <AddStatusForm
        addFormOpen={addFormOpen}
        setAddFormOpen={setAddFormOpen}
      />
    </div>
  );
};

export default StatusChecksPage;
