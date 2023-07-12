import { useEffect, useState } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import {
  Asset,
  AssetLocation,
  AssetPlacement,
  AssetSection,
  AssetType,
} from "types";
import { AssetTypes } from "enums";
import { uploadFiletoS3 } from "utils";
import { toast } from "react-toastify";
import { getAllAssetTypes } from "services/assetTypeServices";
import { getAllAssetLocations } from "services/locationServices";
import {
  createAssetPlacement,
  getAssetPlacements,
} from "services/assetPlacementServices";
import {
  createAssetSection,
  getAssetSections,
} from "services/assetSectionServices";
import { createFile } from "services/fileServices";
import { createAsset } from "services/assetServices";
import useStatusTypeNames from "hooks/useStatusTypes";
import { AiOutlinePaperClip } from "react-icons/ai";
import { TfiClose } from "react-icons/tfi";
import useAssetCondition from "hooks/useAssetCondition";
import { Auth } from "aws-amplify";

const AddAssetForm = ({ addAssetOpen, setAddAssetOpen }) => {
  // Custom hook to fetch asset type names
  const assetTypeNames = useAssetTypeNames();

  // State variables
  const [token, setToken] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [locations, setLocations] = useState<AssetLocation[]>([]);
  const [assetPlacements, setAssetPlacements] = useState<AssetPlacement[]>([]);
  const [assetSections, setAssetSections] = useState<AssetSection[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [filteredSections, setFilteredSections] = useState<AssetSection[]>([]);
  const [filteredPlacements, setFilteredPlacements] = useState<
    AssetPlacement[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [addSection, setAddSection] = useState(false);
  const [addPlacement, setAddPlacement] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("");

  const statusTypeNames = useStatusTypeNames();
  const AssetCondition = useAssetCondition();

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleConditionChange = (event) => {
    setSelectedCondition(event.target.value);
    console.log("selected condition ->", event.target.value);
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    // Filter sections based on the selected location
    const sections = assetSections.filter(
      (section) => section.location_id === locationId
    );
    setFilteredSections(sections);
    // Reset selected section and filtered placements
    setSelectedSection("");
    setFilteredPlacements([]);
  };

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    // Filter placements based on the selected section
    const placements = assetPlacements.filter(
      (placement) => placement.section_id === sectionId
    );
    setFilteredPlacements(placements);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Step 1: Upload the file to S3 bucket
    const imageLocation = await uploadFiletoS3(file, "inventory");
    console.log(imageLocation);

    const userData = await Auth.currentAuthenticatedUser();
    const modifiedBy = userData.attributes.given_name;
    const modifiedDate = String(new Date()).substring(0, 10);

    // Step 2: Create a file in the backend
    const createdFile = await createFile(token, {
      file_id: "",
      file_array: [imageLocation.location],
      modified_by_array: [modifiedBy],
      modified_date_array: [modifiedDate]
    });
    console.log("return from createFile==>>", createdFile);
    const fileId = String(createdFile);

    // Step 3: Prepare the asset data
    const formData = new FormData(event.target);

    //
    console.log("Name from form ==>>", formData.get("name"));

    const assetData = {
      asset_id: null,
      asset_name: formData.get("name") as string,
      asset_type_id: formData.get("type") as string,
      asset_notes: formData.get("notes") as string,
      asset_location: selectedLocation,
      asset_placement: formData.get("placement") as string,
      asset_section: selectedSection,
      asset_status: selectedStatus,
      asset_condition: selectedCondition,
      asset_finance_purchase: parseFloat(
        formData.get("finance_purchase") as string
      ),
      asset_finance_current_value: parseFloat(
        formData.get("finance_current_value") as string
      ),
      images_id: fileId,
      status_check_interval: parseInt(
        formData.get("status_check_interval") as string
      ),
    };

    // Step 4: Create the asset in the backend
    try {
      const createdAsset = await createAsset(token, assetData);
      console.log("Created Asset:", createdAsset);
      toast.success("Asset Added Successfully", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setAddAssetOpen(false);
    } catch (error) {
      console.error("Failed to create asset:", error);
      toast.error("Failed to create asset", {
        position: "bottom-left",
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

  // useEffect hook to retrieve the session token from localStorage
  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    setToken(data);
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = window.localStorage.getItem("sessionToken");

      const [types, locations, placements, sections] = await Promise.all([
        getAllAssetTypes(accessToken),
        getAllAssetLocations(accessToken),
        getAssetPlacements(accessToken),
        getAssetSections(accessToken),
      ]);

      setAssetTypes(types);
      setLocations(locations);
      setAssetPlacements(placements);
      setAssetSections(sections);

      console.log("Asset Types:", types);
      console.log("Asset Locations:", locations);
      console.log("Asset Placements:", placements);
      console.log("Asset Sections:", sections);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle adding a section
  const handleAddSection = async (event) => {
    const formData = new FormData(event.target);
    if (selectedLocation) {
      const sectionName = prompt("Enter Section Name");
      if (sectionName) {
        const newSection: AssetSection = {
          section_id: "",
          section_name: sectionName,
          location_id: selectedLocation,
        };
        try {
          const createdSection = await createAssetSection(token, newSection);
          console.log("Created Section:", createdSection);
          const updatedSections = [...assetSections, createdSection];
          setAssetSections(updatedSections);
          setFilteredSections(updatedSections);

          // Fetch updated data and call handleLocationChange
          fetchData();
          handleLocationChange(selectedLocation);
        } catch (error) {
          console.error("Failed to create section:", error);
        }
      }
    } else {
      alert("Please select a location first.");
    }
  };

  const handleAddPlacement = async () => {
    if (selectedLocation && selectedSection) {
      const placementName = prompt("Enter Placement Name");
      if (placementName) {
        const newPlacement: AssetPlacement = {
          placement_id: "",
          placement_name: placementName,
          section_id: selectedSection,
          location_id: selectedLocation,
        };
        try {
          const createdPlacement = await createAssetPlacement(
            token,
            newPlacement
          );
          console.log("Created Placement:", createdPlacement);
          const updatedPlacements = [...assetPlacements, createdPlacement];
          setAssetPlacements(updatedPlacements);

          // Update filtered placements
          const filteredPlacements = updatedPlacements.filter(
            (placement) => placement.section_id === selectedSection
          );
          setFilteredPlacements(filteredPlacements);

          // Fetch updated data and call handleSectionChange
          fetchData();
          handleSectionChange(selectedSection);
        } catch (error) {
          console.error("Failed to create placement:", error);
        }
      }
    } else {
      alert("Please select a location and section first.");
    }
  };

  // Function to close the add asset form
  const closeAddForm = () => {
    setAddAssetOpen(false);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={addAssetOpen}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="p-2 md:p-0 md:pl-0 md:pb-32 pb-32">
        <div className="p-0 sm:mx-2 bg-white dark:bg-gray-700 rounded-2xl">
          <form method="post" onSubmit={handleSubmit}>
            {/* Modal header */}
            <div className="p-5 bg-white dark:bg-gray-700 flex flex-row rounded-xl">
              <h3 className="font-sans font-bold dark:font-semibold text-lg text-blue-800 dark:text-white ">
                Add Assets
              </h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-blue-800 dark:text-white ml-auto cursor-pointer"
                onClick={closeAddForm}
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="flex flex-col p-5">
              <div className="flex flex-row gap-3 md:gap-0 md:flex-col">
                {/* Input field for asset name */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-black dark:text-white text-sm">
                    Name of Assets
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Asset Name"
                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                  />
                </div>

                {/* Dropdown for asset type */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Asset Type
                  </label>
                  <select
                    name="type"
                    className="select select-sm font-normal my-3 text-black dark:text-white bg-transparent dark:border-gray-500 w-full border border-slate-300"
                  >
                    {/* Map through the asset types */}
                    {assetTypes.map((type) => (
                      <option
                        key={type.asset_type_id}
                        value={type.asset_type_id}
                        className="text-black"
                      >
                        {type.asset_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input field for description */}
              <label className="font-sans font-semibold text-sm text-black dark:text-white">
                Description
              </label>
              <input
                type="text"
                name="notes"
                placeholder="Enter Description"
                className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
              />

              {/* File input for uploading an image */}
              <label
                htmlFor="file_input"
                className="font-sans font-semibold text-sm text-black dark:text-white"
              >
                Add Image
              </label>

              <div className="flex flex-row bg-transparent border border-gray-300 dark:border-gray-500 rounded-xl p-2 my-3">
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    const palceholderText = e.target.files[0];

                    console.log(palceholderText.name);
                  }}
                  className="block w-full text-md text-black border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3 hidden"
                  id="upload"
                />
                <input
                  type="text"
                  className={`bg-transparent text-sm font-sans bg-transparent dark:border-gray-500 w-4/5 md:w-1/2 ${
                    file && file
                      ? "text-black dark:text-white"
                      : "text-gray-400"
                  }`}
                  value={file && file.name ? file.name : "No file chosen"}
                  disabled
                />
                <button
                  className="btn btn-xs bg-transparent hover:bg-transparent normal-case font-normal w-fit border text-blue-600 font-sans text-xs md:text-[9px] border-gray-400 p-0.5 rounded-xl ml-auto"
                  id="upload"
                  onClick={(e) => {
                    e.preventDefault();
                    const uploadButton = document.querySelector(
                      "#upload"
                    ) as HTMLElement;
                    uploadButton.click();
                  }}
                >
                  <div className="flex flex-row items-center gap-0.5 dark:text-white mx-1">
                    <AiOutlinePaperClip className="text-lg" />
                    Choose File
                  </div>
                </button>
              </div>

              {/* Dropdown for selecting asset status */}
              <div className="flex flex-row gap-3 md:flex-col">
                <div className="flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Asset Status
                  </label>
                  <select
                    required
                    name="status"
                    className="select select-sm font-normal my-3 dark:text-white bg-transparent dark:border-gray-500 border border-slate-300 w-full"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="" disabled hidden>
                      Select Asset Status
                    </option>
                    {Object.entries(statusTypeNames).map(
                      ([statusId, statusName]) => (
                        <option
                          key={statusId}
                          value={statusId}
                          className="text-black bg-white dark:text-white dark:bg-gray-800"
                        >
                          {statusName}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex flex-col w-1/2 md:w-auto">
                  {/* Dropdown for selecting location */}
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Select location
                  </label>
                  <select
                    required
                    className="select select-sm font-normal my-3 border border-slate-300 dark:text-white bg-transparent dark:border-gray-500 w-full"
                    onChange={(e) => handleLocationChange(e.target.value)}
                    value={selectedLocation}
                  >
                    <option value="" disabled hidden>
                      Select Location
                    </option>
                    {locations.map((location) => (
                      <option
                        key={location.location_id}
                        value={location.location_id}
                        className="text-black bg-white dark:text-white dark:bg-gray-800"
                      >
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dropdown for selecting asset condition */}
              <div className="flex flex-col w-1/2 md:w-auto">
                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                  Asset Condition
                </label>
                <select
                  required
                  name="condition"
                  className="select select-sm font-normal my-3 dark:text-white bg-transparent dark:border-gray-500 border border-slate-300 w-full"
                  value={selectedCondition}
                  onChange={handleConditionChange}
                >
                  <option value="" disabled hidden>
                    Select Asset Condition
                  </option>
                  {Object.entries(AssetCondition).map(
                    ([conditionKey, conditionValue]) => (
                      <option
                        key={conditionKey}
                        value={conditionKey}
                        className="text-black bg-white dark:text-white dark:bg-gray-800"
                      >
                        {conditionValue}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex flex-row md:flex-col gap-3 md:gap-0">
                {/* Dropdown for selecting section */}
                <div className="dropdown flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Select section
                  </label>
                  <div className="flex flex-row items-center">
                    <div className="w-11/12">
                      <select
                        required
                        className="select select-sm font-normal my-3 border border-slate-300 dark:text-white bg-transparent dark:border-gray-500 w-full"
                        onChange={(e) => handleSectionChange(e.target.value)}
                        value={selectedSection}
                      >
                        <option value="" disabled hidden>
                          Select Section
                        </option>
                        {filteredSections.map((section) => (
                          <option
                            key={section.section_id}
                            value={section.section_id}
                            className="text-black bg-white dark:text-white dark:bg-gray-800"
                          >
                            {section.section_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-1/12 ml-3">
                      <button
                        className="btn btn-sm bg-blue-800 hover:bg-blue-800"
                        onClick={(e) => {
                          e.preventDefault();
                          // setAddSection(true);
                          handleAddSection(e);

                          // (window as any).addSectionModal.showModal();
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropdown for selecting placement */}
                <div className="dropdown flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Select placement
                  </label>
                  <div className="flex flex-row items-center">
                    <div className="w-11/12 ">
                      <select
                        required
                        name="placement"
                        className="select select-sm font-normal my-3 border border-slate-300 dark:text-white bg-transparent dark:border-gray-500 w-full"
                      >
                        <option value="" disabled hidden>
                          Select Placement
                        </option>
                        {filteredPlacements.map((placement) => (
                          <option
                            key={placement.placement_id}
                            value={placement.placement_id}
                            className="text-black bg-white dark:text-white dark:bg-gray-800"
                          >
                            {placement.placement_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/12 ml-3">
                      <button
                        className="btn btn-sm bg-blue-800 hover:bg-blue-800"
                        onClick={(e) => {
                          e.preventDefault();
                          // setAddPlacement(true);
                          handleAddPlacement();
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adding Section */}
              <input
                type="checkbox"
                checked={addSection}
                id="my_modal_6"
                className="modal-toggle"
              />
              <div id="addSectionModal" className="modal">
                <form
                  method="dialog"
                  className="modal-box bg-white dark:bg-gray-800"
                >
                  <div className="flex flex-row mb-5">
                    <h3 className="text-blue-900 font-sans font-semibold dark:text-white">
                      Add Section
                    </h3>
                    <button
                      className="ml-auto"
                      onClick={() => {
                        setAddSection(false);
                      }}
                    >
                      <TfiClose className="font-bold text-black dark:text-white" />
                    </button>
                  </div>
                  <div>
                    <div className={`flex flex-col my-2 gap-3`}>
                      <form className="">
                        <div className="flex flex-col w-full">
                          <label className="font-sans font-semibold text-sm text-black dark:text-white">
                            New Section Name
                          </label>
                          <input
                            type="text"
                            required
                            className="block w-full text-md text-black dark:text-white bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg dark:text-black focus:outline-none dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans"
                          />
                        </div>

                        <div className="w-full mt-4 flex justify-center">
                          <button
                            className="btn btn-sm bg-blue-900 hover:bg-blue-900 mx-auto"
                            onClick={(e) => {
                              e.preventDefault();
                              setAddSection(false);
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </form>
              </div>

              {/* adding placement modal */}
              <input
                type="checkbox"
                checked={addPlacement}
                id="my_modal_6"
                className="modal-toggle"
              />
              <div id="addSectionModal" className="modal">
                <form
                  method="dialog"
                  className="modal-box bg-white dark:bg-gray-800"
                >
                  <div className="flex flex-row mb-5">
                    <h3 className="text-blue-900 font-sans font-semibold dark:text-white">
                      Add Placement
                    </h3>
                    <button
                      className="ml-auto"
                      onClick={() => {
                        setAddPlacement(false);
                      }}
                    >
                      <TfiClose className="font-bold text-black dark:text-white" />
                    </button>
                  </div>
                  <div>
                    <div className={`flex flex-col my-2 gap-3`}>
                      <form className="">
                        <div className="flex flex-col w-full">
                          <label className="font-sans font-semibold text-sm text-black dark:text-white">
                            New Placement Name
                          </label>
                          <input
                            type="text"
                            required
                            className="block w-full text-md text-black dark:text-white bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg dark:text-black focus:outline-none dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans"
                          />
                        </div>

                        <div className="w-full mt-4 flex justify-center">
                          <button
                            className="btn btn-sm bg-blue-900 hover:bg-blue-900 mx-auto"
                            onClick={(e) => {
                              e.preventDefault();
                              setAddPlacement(false);
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </form>
              </div>

              {/* Toggle for status check enabled */}
              <div className="flex items-center my-1">
                <label
                  htmlFor="status_check_enabled"
                  className="font-sans font-semibold text-sm text-black dark:text-white mr-2"
                >
                  Enable Status Check
                </label>
                <input
                  type="checkbox"
                  id="status_check_enabled"
                  className="form-checkbox text-blue-600"
                />
              </div>

              {/* Input field for status check interval */}
              <label className="font-sans font-semibold text-sm text-black dark:text-white mt-2">
                Status Check Interval (in days)
              </label>
              <input
                type="number"
                name="status_check_interval"
                placeholder="Enter Status Check Interval"
                min="1"
                className="input input-bordered input-sm text-sm w-full dark:text-white bg-transparent dark:border-gray-500 my-2 font-sans"
              />

              <div className="flex flex-row md:flex-col gap-3 md:gap-0">
                {/* Input field for finance purchase */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Finance Purchase
                  </label>
                  <input
                    type="number"
                    name="finance_purchase"
                    placeholder="Enter Finance Purchase"
                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                  />
                </div>
                {/* Input field for finance current value */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Finance Current Value
                  </label>
                  <input
                    type="number"
                    name="finance_current_value"
                    placeholder="Enter Finance Current Value"
                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Modal action */}
            <div className="modal-action m-0 p-5 flex justify-center">
              <div>
                {/* WorkOrderButton component */}
                <WorkOrderButton
                  title="Submit"
                  workPending={false}
                  onClick={() => {
                    console.log("Asset Submitted");
                  }}
                  buttonColor={"bg-blue-900"}
                  hoverColor={"hover:bg-blue-900"}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAssetForm;
