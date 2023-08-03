import { useEffect, useRef, useState } from "react";
import "./cardstyles.css";
import AssetCard from "./AssetCard";
import AssetDetails from "./AssetDetails";
// import Pusher from "pusher-js";

import AddAssetForm from "./AddAssetForm";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import { AssetPlacement, AssetSection, IncomingAsset } from "types";
import { Auth } from "aws-amplify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchIcon from "../../icons/circle2017.png";

import { getAssets } from "services/assetServices";
import { getAssetSections } from "services/assetSectionServices";
import { getAssetPlacements } from "services/assetPlacementServices";
import { TfiClose } from "react-icons/tfi";
import { BsFilter } from "react-icons/bs";
import { AiOutlineScan } from "react-icons/ai";
import {
  FilterOptions,
  selectedStatusIds,
  // selectedSectionNames,
  selectedPlacementNames,
} from "./FilterOptions";
import { useNavigate } from "react-router";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";

const ListsLayout = () => {
  const navigate = useNavigate();
  const [location] = useSyncedAtom(locationAtom);
  const [incomingAssets, setIncomingAssets] = useState<IncomingAsset[]>([]); //This is because the fetched assets are a mixture from several tables.
  const [, setAssetId] = useState(null);
  const [sessionToken] = useState<string | null>(null);
  const [, setForceRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  // const [, setNotificationEnabled] = useState(false);
  const [filtersOpen, setFitlersOpen] = useState(false);
  const [selectedButtonsStatus, setSelectedButtonsStatus] = useState([]);
  const [selectedButtonsPlacement, setSelectedButtonsPlacement] = useState([]);
  const [selectedSectionNames, setSelectedSectionNames] = useState<string[]>(
    []
  );
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");

  // state from AddAssetForm.tsx
  const [addAssetOpen, setAddAssetOpen] = useState(false);

  const defaultAssetSections = [
    { section_id: "", section_name: "", location_id: "" },
  ];
  const [assetSections, setAssetSections] =
    useState<AssetSection[]>(defaultAssetSections);
  const [selectedAssetSection] = useState<AssetSection>(
    defaultAssetSections[0]
  );
  //active tabs in asset details card
  const [detailsTab, setDetailsTab] = useState(0);

  const defaultAssetPlacements = [
    { placement_id: "", placement_name: "", section_id: "", location_id: "" },
  ];
  const [assetPlacements, setAssetPlacements] = useState<AssetPlacement[]>(
    defaultAssetPlacements
  );

  const [selectedAssetPlacementName] = useState<string>("");

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

  // const handleSearchInputChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const newSearchTerm = event.target.value;
  //   setSearchTerm(newSearchTerm);

  //   const urlParams = new URLSearchParams(window.location.search);
  //   urlParams.set("search", encodeURIComponent(newSearchTerm));

  //   const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  //   window.history.pushState({}, "", newUrl);
  // };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scannedSearchTerm = urlParams.get("search");
    if (scannedSearchTerm) {
      setSearchTerm(decodeURIComponent(scannedSearchTerm));
    } else {
      clearQueryParams();
    }
  }, []);

  const clearQueryParams = () => {
    const urlWithoutParams = window.location.origin + window.location.pathname;
    window.history.pushState(null, "", urlWithoutParams);
  };

  // useEffect(() => {
  //   const subscribeToPusherChannel = () => {
  //     var pusher = new Pusher("f626cc1d579038ad1013", {
  //       cluster: "ap1",
  //     });

  //     const channel = pusher.subscribe("my-channel");

  //     channel.bind("EVENT_NAME", (data) => {
  //       if (notificationEnabled && Notification.permission === "granted") {
  //         const notification = new Notification("New Event", {
  //           body: data.message,
  //           icon: "/path/to/icon.png",
  //         });
  //         notification.onclick = () => {
  //           // Handle the notification click event
  //         };
  //       }
  //       alert(JSON.stringify(data));
  //     });
  //   };

  //   const requestNotificationPermission = () => {
  //     if (Notification.permission !== "granted") {
  //       Notification.requestPermission().then((permission) => {
  //         if (permission === "granted") {
  // console.log("Notification permission granted");
  //           setNotificationEnabled(true);
  //           // subscribeToPusherChannel();
  //         } else {
  //           console.log("Notification permission denied");
  //         }
  //       });
  //     } else {
  //       console.log("Notification permission already granted");
  //       setNotificationEnabled(true);
  //       // subscribeToPusherChannel();
  //     }
  //   };

  //   requestNotificationPermission();
  // }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const locationId = location.locationId;

        // Fetch assets based on the selected location ID
        const assetsData = await getAssets(authTokenObj.authToken, locationId);

        if (Array.isArray(assetsData)) {
          setIncomingAssets(assetsData);
        } else if (assetsData) {
          setIncomingAssets([assetsData]);
        } else {
          setIncomingAssets([]);
        }

        // console.log("The fetched assets ==>>", assetsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssets();
  }, [location]);

  useEffect(() => {
    const fetchAssetSections = async () => {
      try {
        const fetchedAssetSections = await getAssetSections(
          authTokenObj.authToken
        );

        // Filtering fetched Asset Sections on the basis of selected Location
        const filteredFetchedAssetSections = fetchedAssetSections.filter(
          (section: AssetSection) => section.location_id === location.locationId
        );

        setAssetSections(filteredFetchedAssetSections);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssetSections();
  }, [location]);

  // console.log("Selected Asset Section ==>> ", selectedAssetSectionID);

  useEffect(() => {
    const fetchAssetPlacements = async () => {
      try {
        const fetchedAssetPlacements = await getAssetPlacements(
          authTokenObj.authToken
        );

        // Filtering fetched Asset Placements on the basis of selected Location
        const filteredFetchedAssetPlacements = fetchedAssetPlacements.filter(
          (placement: AssetPlacement) =>
            placement.location_id === location.locationId
        );

        console.log(
          "Fetched Asset Placement (Location Filtered) ==>> ",
          filteredFetchedAssetPlacements
        );

        setAssetPlacements(filteredFetchedAssetPlacements);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssetPlacements();
  }, [location, selectedAssetSection.section_id, selectedAssetPlacementName]);

  const detailsTabIndexRefresh = () => {
    setDetailsTab(0);
  };

  const handleSectionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    if (selectedValue === "") {
      // When "All Sections" is selected, reset selectedSectionNames to []
      setSelectedSectionNames([]);
    } else {
      // When any other option is selected, include only that section_name
      setSelectedSectionNames([selectedValue]);
    }
  };

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleSectionReset = () => {
    if (selectRef.current) {
      selectRef.current.value = "";
      setSelectedSectionNames([]);
    }
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
        className="w-1/3 h-5/6 rounded-xl px-2 py-0 overflow-y-auto lg:w-full asset-card bg-white dark:bg-gray-800"
        id="style-7"
      >
        <div className="flex flex-col">
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className=" justify-center "
          >
            {/* Search input field */}
            <div className="flex flex-col absolute z-10 w-1/3 lg:w-full">
              <div
                style={{ display: "flex", flexDirection: "row" }}
                className=" justify-center bg-white dark:bg-gray-800 py-2"
              >
                {/* Search input field */}
                <div className="flex flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl w-full h-12">
                  <button>
                    <img
                      src={SearchIcon}
                      alt="search"
                      className="h-fit justify-center items-center ml-3"
                    />
                  </button>

                  <input
                    type="text"
                    placeholder="Search Asset"
                    value={searchTerm}
                    className="w-4/5 h-12 p-5 bg-gray-100 dark:bg-gray-700 placeholder-blue-700 dark:placeholder-white text-blue-700 dark:text-white text-sm border-none font-sans"
                    onChange={(e) => {
                      // handleSearchInputChange(e);
                      setShowOptions(true);
                    }}
                  />
                  {searchTerm !== "" && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        clearQueryParams();
                      }}
                    >
                      <TfiClose className="text-blue-600 dark:text-white" />
                    </button>
                  )}
                </div>

                {/* Add asset button */}
                <button
                  className="btn w-28 h-12 ml-3 mr-1 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none"
                  onClick={() => {
                    handleAddAssetOpen();
                    removeClass(
                      "#parent-element .asset-details-card",
                      "lg:hidden"
                    );
                    addClass(
                      "#parent-element .asset-details-card",
                      "lg:w-full"
                    );
                    addClass("#parent-element .asset-card", "lg:hidden");
                  }}
                >
                  + Add
                </button>
                <button
                  className="btn w-28 mt-1 h-fit ml-3 mr-1 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none hidden"
                  onClick={() => navigate("/scan")}
                >
                  <div className="flex flex-row items-center">
                    <AiOutlineScan style={{ marginRight: 5, fontSize: 25 }} />
                    <h1>Scan</h1>
                  </div>
                </button>
              </div>
              <div
                className={`bg-gray-100 mt-1 ${showOptions ? "" : "hidden"} `}
              >
                {incomingAssets
                  .filter((a) => {
                    const SearchTermMatch =
                      a.asset_name
                        .toLowerCase()
                        .startsWith(searchTerm.toLowerCase()) &&
                      searchTerm !== "";

                    return SearchTermMatch;
                  })
                  .slice(0, 5)
                  .map((asset) => (
                    <div
                      className="bg-gray-100 hover:bg-gray-300"
                      onClick={() => {
                        setSearchTerm(asset.asset_name);
                        setShowOptions(false);
                      }}
                    >
                      <p className="ml-10 font-sans text-blue-700 cursor-pointer py-1">
                        {asset.asset_name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div
              className={`flex flex-row w-full justify-around mt-12 ${
                filtersOpen ? "hidden" : ""
              }`}
            >
              <select
                name=""
                id=""
                ref={selectRef}
                onChange={handleSectionSelectChange}
                className="select select-sm bg-white dark:bg-gray-700 text-black dark:text-white border border-slate-300 dark:border-slate-600 w-8/12"
              >
                <option value="">All Sections</option>
                {assetSections
                  .sort((a, b) => a.section_name.localeCompare(b.section_name))
                  .map((section: AssetSection, index: number) => (
                    <option key={index} value={section.section_name}>
                      {section.section_name}
                    </option>
                  ))}
              </select>
              <button
                className="btn btn-sm bg-blue-900 hover:bg-blue-900 text-white border-gray-400 hover:border-gray-400 dark:border-gray-600 rounded-3xl font-sans font-semibold capitalize text-black"
                onClick={() => setFitlersOpen(true)}
              >
                <div className="flex flex-row">
                  Filters
                  <BsFilter />
                </div>
              </button>
            </div>
          </div>
          {filtersOpen ? (
            <div className="mt-10">
              <FilterOptions
                filterClose={() => setFitlersOpen(false)}
                placements={assetPlacements}
                selectedButtonsPlacement={selectedButtonsPlacement}
                setSelectedButtonsPlacement={setSelectedButtonsPlacement}
                selectedButtonsStatus={selectedButtonsStatus}
                setSelectedButtonsStatus={setSelectedButtonsStatus}
                handleSectionReset={handleSectionReset}
              />
            </div>
          ) : (
            <div>
              {/* Render asset cards */}
              {incomingAssets
                .filter((asset) => {
                  const searchTermMatch =
                    searchTerm === "" ||
                    asset.asset_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    asset.asset_type
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                  const statusFilterMatch =
                    selectedStatusIds.length === 0 ||
                    selectedStatusIds.includes(asset.asset_status);

                  const sectionFilterMatch =
                    selectedSectionNames.length === 0 ||
                    selectedSectionNames.includes(asset.section_name);

                  const placementFilterMatch =
                    selectedPlacementNames.length === 0 ||
                    selectedPlacementNames.includes(asset.placement_name);

                  /* sectionFilterMatch AND placementFilterMatch */
                  const intersectionFilterMatch =
                    sectionFilterMatch && placementFilterMatch;

                  return (
                    searchTermMatch &&
                    statusFilterMatch &&
                    (selectedSectionNames.length === 0 ||
                    selectedPlacementNames.length === 0
                      ? intersectionFilterMatch
                      : intersectionFilterMatch)
                  );
                })
                .map((asset) => (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setAssetId(asset.asset_id);
                      setAddAssetOpen(false);
                      removeClass(
                        "#parent-element .asset-details-card",
                        "lg:hidden"
                      );
                      addClass(
                        "#parent-element .asset-details-card",
                        "lg:w-full"
                      );
                      addClass("#parent-element .asset-card", "lg:hidden");
                    }}
                  >
                    <AssetCard
                      assetName={asset.asset_name}
                      assetType={asset.asset_type}
                      assetAddress={asset.location_name}
                      imageLocation={asset.images_array[0]}
                      status={asset.asset_status}
                      assetCondition={asset.asset_condition}
                      imagePlaceholder="img"
                      updatedDetailsTabIndex={detailsTabIndexRefresh}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-2/3 z-20 h-6/6 p-2 md:p-0 overflow-y-auto bg-gray-200 dark:bg-black lg:bg-white lg:dark:bg-gray-700  lg:hidden asset-details-card md:pb-14`}
        id="style-7"
      >
        {/* Render asset details */}
        {selectedAsset ? (
          <>
            {addAssetOpen ? (
              <AddAssetForm
                addAssetOpen={addAssetOpen}
                setAddAssetOpen={() => {
                  setAddAssetOpen(false);
                  setSelectedAsset(null);
                }}
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
                assetCondition={selectedAsset.asset_condition}
                assetTypeId={selectedAsset.asset_type_id}
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
    </div>
  );
};

// {
//    ListsLayout.propTypes = {
//   searchType: PropTypes.string,
// };

// ListsLayout.defaultProps = {
//   searchType: "Item",
// };
// }

export default ListsLayout;
