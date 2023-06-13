import { useEffect, useState } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import { Asset, Document } from "types";
import { AssetTypes } from "enums";
import { uploadFiletoS3 } from "utils";
import { addInventory } from "services/apiServices";
import { toast } from "react-toastify";
import { createFile } from "services/fileServices";
import { createDocument } from "services/documentServices";

const AddDocumentsForm = ({
  addDocumentsOpen,
  setAddDocumentsOpen,
  assetID = null,
  locationID = null,
}) => {
  const assetTypeNames = useAssetTypeNames();

  const [token, settoken] = useState<string>("");
  const [file, setFile] = useState<any>();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAddDocumentsOpen(false);

    // Step 1: Upload the file to S3 bucket
    const documentLocation = await uploadFiletoS3(file, "document");
    console.log("documentLocation ==>> ", documentLocation);

    // Step 2: Create a file in the backend
    const createdFile = await createFile(token, {
      file_id: null,
      file_array: [documentLocation.location],
    });
    console.log("Return from createFile (file_id) ==>> ", createdFile);
    const fileId = String(createdFile);

    // Step 3: Prepare the document data
    const formData = new FormData(event.target);

    console.log(
      "Document name from form ==>> ",
      formData.get("name") as string
    );

    const documentData: Document = {
      document_id: null,
      document_name: formData.get("name") as string,
      document_description: formData.get("description") as string,
      document_type_id: formData.get("type") as string,
      start_date: formData.get("startDate") as string,
      end_date: formData.get("endDate") as string,
      file_id: fileId,
      document_notes: formData.get("notes") as string,
      modified_by: "hardCodedTestUser",
      modified_date: (new Date()).toString(),
      org_id: "hardCodedOrgID",
      asset_id: assetID,
      location_id: locationID,
    };

    // Step 4: Create the document in the backend
    try {
      const createdDocument = await createDocument(token, documentData);
      console.log("Created Document:", createdDocument);
      toast.success("Document Added Successfully", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setAddDocumentsOpen(false);
    } catch (error) {
      console.error("Failed to create document:", error);
      toast.error("Failed to create document", {
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
                name="name"
                required
                placeholder="Enter Document Name"
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
                name="type"
                className="select select-sm my-3 w-full border border-slate-300"
                required
              >
                <option value={null} disabled selected hidden>Select Document Type</option>
                <option value="17fb9bcc-2e34-4e21-821e-6ff0988ec5ae">
                  Certificates
                </option>
                <option value="c689cd33-2f83-4774-aac7-6bc7841dde37">
                  Contract
                </option>
                <option value="eb02fd38-9da6-4b68-9a27-23c3ca446d76">
                  Invoices
                </option>
                <option value="31a03294-d1f7-4d5e-a644-7904b72b97dc">
                  License
                </option>
                <option value="25020808-e9e7-4d42-b94d-06cc7ebb9db2">
                  Rental Agreement
                </option>
                <option value="6ada07ac-b8e1-464b-a9d9-4495147e8fe4">
                  Others
                </option>
              </select>

              <div className="flex flex-row gap-2 my-3">
                <div className="flex flex-col">
                  <label className="font-sans font-semibold text-sm text-black">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
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
                    name="endDate"
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
                name="description"
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
                name="file"
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
                name="notes"
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
