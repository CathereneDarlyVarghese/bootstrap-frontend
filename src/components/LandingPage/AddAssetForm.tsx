import { useEffect, useState } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import { Asset } from "types";
import { AssetTypes } from "enums";
import { uploadFiletoS3 } from "utils";
import { addInventory } from "services/apiServices";
import { RadioButton } from "@ui5/webcomponents-react";
import { toast } from "react-toastify";

const AddAssetForm = ({ addAssetOpen, setAddAssetOpen }) => {
  // Custom hook to fetch asset type names
  const assetTypeNames = useAssetTypeNames();

  // State variables
  const [token, settoken] = useState<string>("");
  const [file, setFile] = useState<any>();
  const [data, setData] = useState<Asset>({
    organization: {
      name: "testorg1",
      id: "2",
      members: [],
    },
    orgId: "2",
    audit: {
      createdAt: "test",
      createdBy: "test",
    },
    id: "2",
    name: "",
    imageS3: "",
    location: "sg",
    workOrders: [],
    type: AssetTypes.Appliances,
  });

  // Function to handle form submission
  const handleSubmit = async () => {
    console.log(data);
    setAddAssetOpen(false);
    try {
      // Upload file to S3 bucket
      const imageLocation = await uploadFiletoS3(file, "inventory");
      console.log(imageLocation);
      data.imageS3 = imageLocation.location;

      // Add inventory using the API service
      await addInventory(token, data)
        .then(() => {
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
          // navigate(`/location?name=${data.location}`); // Navigate to the page of the location
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  // useEffect hook to retrieve the session token from localStorage
  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    settoken(data);
  }, []);

  // Function to close the add asset form
  const closeAddForm = () => {
    setAddAssetOpen(false);
  };

  return (
    <>
      {/* Checkbox for modal toggle */}
      <input
        type="checkbox"
        checked={addAssetOpen}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box p-0 w-full sm:mx-2">
          <form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Modal header */}
            <div className="p-5 bg-white flex flex-row">
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
              {/* Input field for asset name */}
              <label className="font-sans font-semibold text-black text-sm">
                Name of Assets
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter Asset Name"
                onChange={(e) =>
                  setData((curr) => ({ ...curr, name: e.target.value }))
                }
                value={data.name}
                className="input input-bordered input-sm text-sm w-full my-3 font-sans"
              />
              <label className="font-sans font-semibold text-sm text-black">
                Description
              </label>
              <input
                type="text"
                id="desciption"
                placeholder="Enter Description"
                onChange={(e) =>
                  setData((curr) => ({ ...curr, name: e.target.value }))
                }
                value={data.name}
                className="input input-bordered input-sm text-sm w-full my-3 font-sans"
              />
              <label className="font-sans font-semibold text-sm text-black">
                Asset Type
              </label>
              <select className="select select-sm my-3 w-full">
                <option selected>Appliance</option>
              </select>

              {/* File input for uploading an image */}
              <label
                htmlFor="file_input"
                className="font-sans font-semibold text-sm text-black"
              >
                Add Image
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-white border border-gray-300 rounded-lg cursor-pointer bg-blue-900 dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white my-3"
                style={{}}
              />

              {/* Dropdown for selecting location */}
              <div className="dropdown flex flex-col">
                <label className="font-sans font-semibold text-sm text-black">
                  Select location
                </label>
                <select
                  required
                  className="select select-sm my-3 2xl:w-full md:w-fit"
                  onChange={(e) => {
                    setData((curr) => ({ ...curr, location: e.target.value }));
                  }}
                >
                  <option value="" disabled selected hidden>
                    Select Location
                  </option>
                  <option value="tsd">The Spiffy Dapper</option>
                  <option value="mdb">MadDog Bistro & Bar</option>
                </select>
              </div>

              {/* Radio button for asset type */}
              {/* {[AssetTypes.Appliances].map((type) => (
                <RadioButton
                  key={type}
                  name="type"
                  text={assetTypeNames[type]}
                  value={AssetTypes.Appliances}
                  checked={type === data.type}
                  onChange={() => setData((curr) => ({ ...curr, type }))}
                />
              ))} */}
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
