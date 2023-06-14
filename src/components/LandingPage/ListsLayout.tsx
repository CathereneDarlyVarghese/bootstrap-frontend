import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
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

  const [activeTab, setActiveTab] = useState(0);
  //sample array for pillblock nav tabs
  const tabs = ["VIP Lounge", "Bar area", "Kitchen area", "Stag area", "Lounge", "Restroom"]
  const [scroll, setScroll] = useState(false);

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

  // function to add and remove class for UI
  const addClass = (selectClass, addClass) => {
    document.querySelector(selectClass).classList.add(addClass);
  };

  const removeClass = (selectClass, removeClass) => {
    document.querySelector(selectClass).classList.remove(removeClass);
  };



  //button to scroll pill navigation
  const scrollLeft = () => {
    setScroll(true);
    if (scroll) {
      document.getElementById("scrollFirst").scrollIntoView({
        inline: "start",
        behavior: "smooth",
        block: "nearest"
      })
    }
  }

  const scrollRight = () => {
    setScroll(true);
    if (scroll) {
      document.getElementById("scrollLast").scrollIntoView({
        inline: "start",
        behavior: "smooth",
        block: "nearest"
      })
    }
  }


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
      className="bg-primary-content h-full "
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
            onClick={() => {
              handleAddAssetOpen();
              removeClass("#parent-element .asset-details-card", "lg:hidden");
              addClass("#parent-element .asset-details-card", "lg:w-full");
              addClass("#parent-element .asset-card", "lg:hidden");
            }}
          >
            + Add
          </button>

        </div>
        <div>
          <div className="tabs flex flex-row items-center" id="container" style={{ width: "100%", display: "flex", flexDirection: "row" }}>
            <button className="btn btn-sm rounded-2xl text-black md:hidden bg-transparent border-none hover:bg-blue-200 justify-center" id="scrollButton" onClick={scrollLeft}>{"<<"}</button>
            <div className="overflow-x-auto flex-grow" id="style-7" style={{ width: "80%" }}>
              <ul className="flex flex-row">

                {tabs.map((item, index) => (
                  <li>
                    <button className={`btn bg-transparent font-sans text-xs md:text-[10px] ${activeTab === index ? "text-blue-900 border-b-blue-800 hover:border-b-blue-800 font-bold" : "text-gray-500 font-normal"} normal-case w-24 p-0 border-transparent rounded-none hover:bg-transparent hover:border-transparent `}
                      id={`${index === tabs.length - 1 ? "scrollLast" : index === 0 ? "scrollFirst" : ""}`}

                      onClick={() => {
                        setActiveTab(index)
                      }}>
                      {item}
                    </button>
                  </li>

                ))}
                {/* <li>
                  <button className={`btn bg-transparent font-sans text-xs md:text-[10px] ${activeTab === 0 ? "text-blue-900 border-b-blue-800 hover:border-b-blue-800 font-bold" : "text-gray-500 font-normal"} normal-case w-24 p-0 border-transparent rounded-none hover:bg-transparent hover:border-transparent `}
                    id="scrollLast">
                    test
                  </button>
                </li> */}

              </ul>
            </div>
            <button className="btn btn-sm rounded-2xl text-black md:hidden bg-transparent border-none hover:bg-blue-200 justify-center" id="scrollButton" onClick={scrollRight}>{">>"}</button>


          </div>
          <div className="px-2">
            <select className="select select-sm md:select-xs mb-3 md:mt-2 border border-slate-300 w-full">
              <option>Front Bar</option>
              <option>Left Corner</option>
              <option>Right Corner</option>
              <option>Ceiling</option>
            </select>
          </div>
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

        <div>
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
      </div>
      <div
        className="w-2/3 h-6/6 p-2 md:p-0 overflow-y-auto bg-gray-200 lg:bg-white lg:hidden asset-details-card md:pb-14"
        id="style-7"
      >

        {/* Render asset details */}
        {selectedAsset ? (
          <>
            {addAssetOpen ? (
              <AddAssetForm
                addAssetOpen={addAssetOpen}
                setAddAssetOpen={setAddAssetOpen}
              />
            ) : (
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
            )}
          </>
        ) : (
          addAssetOpen ? (
            <AddAssetForm
              addAssetOpen={addAssetOpen}
              setAddAssetOpen={() => {
                setAddAssetOpen(prev => !prev);
                addClass("#parent-element .asset-details-card", "lg:hidden");
                removeClass("#parent-element .asset-details-card", "w-full");
                removeClass("#parent-element .asset-card", "lg:hidden");
              }}
            />
          ) : (
            <div className="flex items-center h-fit my-52 mx-auto justify-center">
              <h1 className="font-bold text-3xl text-slate-400">
                Choose an Asset
              </h1>
            </div>
          )

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
