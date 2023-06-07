import { useEffect, useState } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import { Asset } from "types";
import { AssetTypes } from "enums";
import { uploadFiletoS3 } from "utils";
import { addInventory } from "services/apiServices";
import { toast } from "react-toastify";

const AddDocumentsForm = ({ addDocumentsOpen, setAddDocumentsOpen }) => {
  const assetTypeNames = useAssetTypeNames();

  const [token, settoken] = useState<string>("");
  const [file, setFile] = useState<any>();

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddDocumentsOpen(false);
  };

  // useEffect hook to retrieve the session token from localStorage
  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    settoken(data);
  }, []);

  // Function to close the add asset form
  const closeAddForm = () => {
    setAddDocumentsOpen(false);
  };

  return (
    <>
      {/* Checkbox for modal toggle */}
      <input
        type="checkbox"
        checked={addDocumentsOpen}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box p-0 w-full sm:mx-2">
          <form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* Modal header */}
            <div className="p-5 bg-white flex flex-row">
              <h3 className="font-sans font-bold text-lg text-blue-800">
                Add Document
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
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="Enter Asset Name"
                // onChange={(e) =>
                //   setData((curr) => ({ ...curr, name: e.target.value }))
                // }
                // value={data.name}
                className="input input-bordered input-sm text-sm w-full my-3 font-sans"
              />
              <label className="font-sans font-semibold text-sm text-black">
                Document Type
              </label>
              <select
                className="select select-sm my-3 w-full border border-slate-300"
                required
              >
                <option>Invoice</option>
                <option>Contract</option>
                <option>Certificate</option>
                <option>License</option>
                <option>Others</option>
              </select>

              <div className="flex flex-row gap-2 my-3">
                <div className="flex flex-col">
                  <label className="font-sans font-semibold text-sm text-black">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    className="font-sans font-semibold text-sm text-black my-3"
                  />
                </div>
                <div className="flex flex-col ml-auto">
                  <label className="font-sans font-semibold text-sm text-black">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    className="font-sans font-semibold text-sm text-black my-3"
                  />
                </div>
              </div>

              <label className="font-sans font-semibold text-sm text-black">
                Description
              </label>
              <input
                type="text"
                id="desciption"
                required
                placeholder="Enter Description"
                // onChange={(e) =>
                //   setData((curr) => ({ ...curr, name: e.target.value }))
                // }
                // value={data.name}
                className="input input-bordered input-sm text-sm w-full my-3 font-sans"
              />

              {/* File input for uploading an image */}
              <label
                htmlFor="file_input"
                className="font-sans font-semibold text-sm text-black"
              >
                Upload File
              </label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-md text-white border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3"
                style={{}}
              />
              <label className="font-sans font-semibold text-sm text-black">
                Notes
              </label>
              <input
                type="text"
                id="notes"
                placeholder="Enter Description"
                // onChange={(e) =>
                //   setData((curr) => ({ ...curr, name: e.target.value }))
                // }
                // value={data.name}
                className="input input-bordered input-sm text-sm w-full my-3 font-sans"
              />
            </div>

            {/* Modal action */}
            <div className="modal-action m-0 p-5 flex justify-center">
              <div>
                {/* WorkOrderButton component */}
                <WorkOrderButton
                  title="Submit"
                  workPending={false}
                  onClick={handleSubmit}
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

export default AddDocumentsForm;
