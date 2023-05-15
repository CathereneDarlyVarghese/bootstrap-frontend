import React, { useEffect, useState } from "react";
import WorkorderButton from "components/widgets/WorkorderButton";
import { useNavigate } from "react-router-dom";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import { Asset } from "types";
import { AssetTypes } from "enums";
import { uploadFiletoS3 } from "utils";
import { addInventory } from "services/apiServices";
import { RadioButton } from "@ui5/webcomponents-react";

const AddAssetForm = ({ addAssetOpen, setAddAssetOpen, notific }) => {
  const navigate = useNavigate();
  const assetTypeNames = useAssetTypeNames();
  const [dropdownopen, setDropdownopen] = useState<boolean>(false);
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
  const handleSubmit = async () => {
    console.log(data);
    try {
      const imageLocation = await uploadFiletoS3(file, "inventory");
      console.log(imageLocation);
      data.imageS3 = imageLocation.location;
      await addInventory(token, data);
    } catch (error) {
      alert("something went wrong!");
    }
  };

  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    settoken(data);
  }, []);

  const openAddForm = () => {
    setAddAssetOpen(true);
  };
  const closeAddForm = () => {
    setAddAssetOpen(false);
  };

  const toggleDropDown = () => {
    setDropdownopen(!dropdownopen);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    <>
      <input
        type="checkbox"
        checked={addAssetOpen}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box p-0 w-full">
          <form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="p-5 bg-blue-900 flex flex-row">
              <h3 className="font-bold text-white font-bold">Add Assets</h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-white ml-auto cursor-pointer"
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
              <input
                type="text"
                id="name"
                placeholder="Name"
                onChange={(e) =>
                  setData((curr) => ({ ...curr, name: e.target.value }))
                }
                value={data.name}
                className="input input-bordered input-info w-full my-3"
              />
              {[AssetTypes.Appliances].map((type) => (
                <RadioButton
                  key={type}
                  name="type"
                  text={assetTypeNames[type]}
                  value={AssetTypes.Appliances}
                  checked={type === data.type}
                  onChange={() => setData((curr) => ({ ...curr, type }))}
                />
              ))}
              <label
                htmlFor="file_input"
                // className="btn bg-blue-900 hover:bg-blue-900 w-full my-5"
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  // className="file-input file-input-bordered file-input-sm appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  className="file-input file-input-bordered border-info w-full my-3"
                  style={{}}
                />
              </label>
              {/* Location dropdown */}
              <div className="dropdown">
                <select
                  required
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={(e) => {
                    setData((curr) => ({ ...curr, location: e.target.value }));
                  }}
                  value={data.location}
                >
                  <option value="sg">Singapore</option>
                  <option>Location B</option>
                  <option>Location C</option>
                </select>
              </div>
            </div>
            <div className="modal-action p-5">
              <WorkorderButton
                title="Submit"
                workPending={false}
                onClick={handleSubmit}
                buttonColor={"bg-blue-900"}
                hoverColor={"hover:bg-blue-900"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAssetForm;
