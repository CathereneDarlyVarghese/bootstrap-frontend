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
import { getAssetPlacements } from "services/assetPlacementServices";
import { getAssetSections } from "services/assetSectionServices";
import { createFile } from "services/fileServices";
import { createAsset } from "services/assetServices";
import useStatusTypeNames from "hooks/useStatusTypes";
import { AiOutlinePaperClip } from "react-icons/ai";

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

  const statusTypeNames = useStatusTypeNames();

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
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

    // Step 2: Create a file in the backend
    const createdFile = await createFile(token, {
      file_id: "",
      file_array: [imageLocation.location],
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

  useEffect(() => {
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

    fetchData();
  }, []);

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
      <div className="p-2 md:p-0 md:pl-0 md:pb-32 pb-32" >
        <div className="p-0 sm:mx-2 bg-white rounded-2xl">
          <form method="post" onSubmit={handleSubmit}>
            {/* Modal header */}
            <div className="p-5 bg-white flex flex-row rounded-xl">
              <h3 className="font-sans font-bold text-lg text-blue-800">
                Add Assets
              </h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-blue-800 ml-auto cursor-pointer"
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
                  <label className="font-sans font-semibold text-black text-sm">
                    Name of Assets
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Asset Name"
                    className="input input-bordered input-sm text-sm w-full my-3 font-sans"
                  />
                </div>

                {/* Dropdown for asset type */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black">
                    Asset Type
                  </label>
                  <select
                    name="type"
                    className="select select-sm font-normal my-3 w-full border border-slate-300"
                  >
                    {/* Map through the asset types */}
                    {assetTypes.map((type) => (
                      <option key={type.asset_type_id} value={type.asset_type_id}>
                        {type.asset_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input field for description */}
              <label className="font-sans font-semibold text-sm text-black">
                Description
              </label>
              <input
                type="text"
                name="notes"
                placeholder="Enter Description"
                className="input input-bordered input-sm text-sm w-full my-3 font-sans"
              />



              {/* File input for uploading an image */}
              <label
                htmlFor="file_input"
                className="font-sans font-semibold text-sm text-black"
              >
                Add Image
              </label>

              <div className="flex flex-row bg-transparent border border-gray-300 rounded-xl p-2 my-3" >
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0])
                    const palceholderText = e.target.files[0];

                    console.log(palceholderText.name)
                  }}
                  className="block w-full text-md text-black border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3 hidden"
                  id="upload"
                />
                <input type="text" className={`bg-transparent text-sm font-sans w-4/5 md:w-1/2 ${file && file ? "text-black" : "text-gray-400"}`} value={file && file.name ? (file.name) : "No file chosen"} disabled />
                <button className="btn btn-xs bg-transparent hover:bg-transparent normal-case font-normal w-fit border text-blue-600 font-sans text-xs md:text-[9px] border-gray-400 p-0.5 rounded-xl ml-auto" id="upload" onClick={(e) => {
                  e.preventDefault()
                  const uploadButton = document.querySelector("#upload") as HTMLElement
                  uploadButton.click()
                }}>
                  <div className="flex flex-row items-center gap-0.5 mx-1">
                    <AiOutlinePaperClip className="text-lg" />
                    Choose File
                  </div>
                </button>

              </div>

              {/* Dropdown for selecting asset status */}
              <div className="flex flex-row gap-3 md:flex-col">
                <div className="flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black">
                    Asset Status
                  </label>
                  <select
                    required
                    name="status"
                    className="select select-sm font-normal my-3 border border-slate-300 w-full"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="" disabled hidden>
                      Select Asset Status
                    </option>
                    {Object.entries(statusTypeNames).map(
                      ([statusId, statusName]) => (
                        <option key={statusId} value={statusId}>
                          {statusName}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex flex-col w-1/2 md:w-auto">
                  {/* Dropdown for selecting location */}
                  <label className="font-sans font-semibold text-sm text-black">
                    Select location
                  </label>
                  <select
                    required
                    className="select select-sm font-normal my-3 border border-slate-300 w-full"
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
                      >
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="flex flex-row md:flex-col gap-3 md:gap-0">
                {/* Dropdown for selecting section */}
                <div className="dropdown flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black">
                    Select section
                  </label>
                  <select
                    required
                    className="select select-sm font-normal my-3 border border-slate-300 w-full"
                    onChange={(e) => handleSectionChange(e.target.value)}
                    value={selectedSection}
                  >
                    <option value="" disabled hidden>
                      Select Section
                    </option>
                    {filteredSections.map((section) => (
                      <option key={section.section_id} value={section.section_id}>
                        {section.section_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Dropdown for selecting placement */}
                <div className="dropdown flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black">
                    Select placement
                  </label>
                  <select
                    required
                    name="placement"
                    className="select select-sm font-normal my-3 border border-slate-300 w-full"
                  >
                    <option value="" disabled hidden>
                      Select Placement
                    </option>
                    {filteredPlacements.map((placement) => (
                      <option
                        key={placement.placement_id}
                        value={placement.placement_id}
                      >
                        {placement.placement_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggle for status check enabled */}
              <div className="flex items-center my-1">
                <label
                  htmlFor="status_check_enabled"
                  className="font-sans font-semibold text-sm text-black mr-2"
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
              <label className="font-sans font-semibold text-sm text-black mt-2">
                Status Check Interval (in days)
              </label>
              <input
                type="number"
                name="status_check_interval"
                placeholder="Enter Status Check Interval"
                min="1"
                className="input input-bordered input-sm text-sm w-full my-2 font-sans"
              />

              <div className="flex flex-row md:flex-col gap-3 md:gap-0">
                {/* Input field for finance purchase */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black">
                    Finance Purchase
                  </label>
                  <input
                    type="number"
                    name="finance_purchase"
                    placeholder="Enter Finance Purchase"
                    className="input input-bordered input-sm text-sm w-full my-3 font-sans"
                  />
                </div>
                {/* Input field for finance current value */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black">
                    Finance Current Value
                  </label>
                  <input
                    type="number"
                    name="finance_current_value"
                    placeholder="Enter Finance Current Value"
                    className="input input-bordered input-sm text-sm w-full my-3 font-sans"
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
