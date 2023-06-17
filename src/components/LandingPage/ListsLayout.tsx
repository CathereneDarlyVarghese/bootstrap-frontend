import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import PropTypes from "prop-types";
import "./cardstyles.css";
import AssetCard from "./AssetCard";
import AssetDetails from "./AssetDetails";

import AddAssetForm from "./AddAssetForm";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import { Asset, AssetPlacement, AssetSection, IncomingAsset } from "types";
import { Auth } from "aws-amplify";
import { getInventory } from "services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkOrderForm from "./WorkOrderForm1";

import SearchIcon from "../../icons/circle2017.png";

//sample image for ui testing
import testImage from "./testImage.png";
import { getAllAssets, getAssets } from "services/assetServices";
import { getAssetSections } from "services/assetSectionServices";
import { getAssetPlacements } from "services/assetPlacementServices";

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
  const defaultAssetSections = [
    { section_id: "", section_name: "", location_id: "" },
  ];
  const [assetSections, setAssetSections] =
    useState<AssetSection[]>(defaultAssetSections);
  const [selectedAssetSectionID, setSelectedAssetSectionID] =
    useState<string>("");
  const [scroll, setScroll] = useState(false);
  //active tabs in asset details card
  const [detailsTab, setDetailsTab] = useState(0);

  const defaultAssetPlacements = [
    { placement_id: "", placement_name: "", section_id: "", location_id: "" },
  ];
  const [assetPlacements, setAssetPlacements] = useState<AssetPlacement[]>(
    defaultAssetPlacements
  );
  const [selectedAssetPlacementID, setSelectedAssetPlacementID] =
    useState<string>("");

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
        block: "nearest",
      });
    }
  };

  const scrollRight = () => {
    setScroll(true);
    if (scroll) {
      document.getElementById("scrollLast").scrollIntoView({
        inline: "start",
        behavior: "smooth",
        block: "nearest",
      });
    }
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

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.accessToken.jwtToken);

        // Retrieve the location ID from the location state
        const locationId = location.locationId;

        // Fetch assets based on the selected location ID
        const assetsData = await getAssets(
          userData.signInUserSession.accessToken.jwtToken,
          locationId
        );

        if (Array.isArray(assetsData)) {
          setIncomingAssets(assetsData);
        } else if (assetsData) {
          setIncomingAssets([assetsData]);
        } else {
          setIncomingAssets([]);
        }

        console.log("The fetched assets ==>>", assetsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssets();
  }, [location]); // Add the 'location' dependency to re-fetch assets when location changes

  useEffect(() => {
    const fetchAssetSections = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();

        const fetchedAssetSections = await getAssetSections(
          userData.signInUserSession.accessToken.jwtToken
        );
        setAssetSections(fetchedAssetSections);
        // console.log("Fetched Asset Sections ==>> ", fetchedAssetSections);

        if (selectedAssetSectionID === "") {
          setSelectedAssetSectionID(fetchedAssetSections[0].section_id);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssetSections();
  }, []);

  useEffect(() => {
    const fetchAssetPlacements = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();

        const fetchedAssetPlacements = await getAssetPlacements(
          userData.signInUserSession.accessToken.jwtToken
        );
        setAssetPlacements(fetchedAssetPlacements);

        console.log("Fetched Asset Placement ==>> ", fetchedAssetPlacements);

        const filteredFetchedAssetPlacements = fetchedAssetPlacements.filter(
          (placement: AssetPlacement) =>
            placement.section_id === selectedAssetSectionID
        );

        setAssetPlacements(filteredFetchedAssetPlacements);

        console.log(
          "Filtered Fetched Asset Placement ==>> ",
          filteredFetchedAssetPlacements
        );

        if (selectedAssetPlacementID === "") {
          setSelectedAssetPlacementID(
            filteredFetchedAssetPlacements[0].placement_id
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssetPlacements();
  }, [selectedAssetSectionID]);

  const detailsTabIndexRefresh = (tabIndex) => {
    setDetailsTab(0);
  };

  return (
    <div
      className="bg-primary-content h-full dark:bg-gray-800"
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
        className="w-1/3 h-5/6 rounded-xl p-2 overflow-y-auto lg:w-full asset-card bg-white dark:bg-gray-800"
        id="style-7"
      >
        <div
          style={{ display: "flex", flexDirection: "row" }}
          className="items-center justify-center"
        >
          {/* Search input field */}
          <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl w-full">
            <button>
              <img
                src={SearchIcon}
                className="h-fit justify-center items-center ml-3"
              />
            </button>

            <input
              type="text"
              placeholder="Search Appliance"
              className="w-4/5 h-12 p-5 bg-gray-100 dark:bg-gray-700 placeholder-blue-700 dark:placeholder-white text-blue-700 dark:text-white text-sm border-none font-sans"
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
          <div
            className="tabs flex flex-row items-center"
            id="style-7"
            style={{ width: "100%", display: "flex", flexDirection: "row" }}
          >
            <button
              className="btn btn-sm rounded-2xl text-black dark:text-white md:hidden bg-transparent border-none hover:bg-blue-200 hover:dark:bg-gray-600 justify-center"
              id="scrollButton"
              onClick={scrollLeft}
            >
              {"<<"}
            </button>
            <div
              className="overflow-x-auto flex-grow"
              id="style-7"
              style={{ width: "75%" }}
            >
              <ul className="flex flex-row">
                {assetSections.map((item, index) => (
                  <li>
                    <button
                      className={`btn bg-transparent font-sans text-xs md:text-[10px] ${
                        activeTab === index
                          ? "text-blue-900 dark:text-white border-b-blue-800 dark:border-b-white hover:border-b-blue-800 hover:dark:border-b-white font-bold"
                          : "text-gray-500 dark:text-gray-400 font-normal"
                      } normal-case w-24 p-0 border-transparent rounded-none hover:bg-transparent hover:border-transparent `}
                      id={`${
                        index === assetSections.length - 1
                          ? "scrollLast"
                          : index === 0
                          ? "scrollFirst"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveTab(index);
                        setSelectedAssetSectionID(item.section_id);
                      }}
                    >
                      {item.section_name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn btn-sm rounded-2xl text-black hover:dark:bg-gray-600 dark:text-white md:hidden bg-transparent border-none hover:bg-blue-200 justify-center"
              id="scrollButton"
              onClick={scrollRight}
            >
              {">>"}
            </button>
          </div>
          <div className="px-2">
            <select className="select select-sm md:select-xs bg-white dark:bg-gray-700 text-black dark:text-white mb-3 md:mt-2 border border-slate-300 dark:border-gray-600 w-full">
              {/* <option value="" hidden disabled selected>Select a Placement</option> */}
              {assetPlacements.map((placement) => (
                <option
                  key={placement.placement_name}
                  value={placement.placement_name}
                >
                  {placement.placement_name}
                </option>
              ))}
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
                updatedDetailsTabIndex={detailsTabIndexRefresh}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className={`w-2/3 h-6/6 p-2 md:p-0 overflow-y-auto bg-gray-200 dark:bg-black lg:bg-white lg:dark:bg-gray-700  lg:hidden asset-details-card md:pb-14`}
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
                tabIndex={detailsTab}
                setTabIndex={setDetailsTab}
                assetCheckDate={selectedAsset.next_asset_check_date}
              />
            )}
          </>
        ) : addAssetOpen ? (
          <AddAssetForm
            addAssetOpen={addAssetOpen}
            setAddAssetOpen={() => {
              setAddAssetOpen((prev) => !prev);
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
