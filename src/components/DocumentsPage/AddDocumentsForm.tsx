import { useEffect, useState } from "react";
import { Document, DocumentType } from "types";
import { uploadFiletoS3 } from "utils";
import { toast } from "react-toastify";
import { createFile } from "services/fileServices";
import { createDocument } from "services/documentServices";
import { getAllDocumentTypes } from "services/documentTypeServices";

const AddDocumentsForm = ({
  addDocumentsOpen,
  setAddDocumentsOpen,
  assetID = null,
  locationID = null,
}) => {
  const [token, setToken] = useState<string>("");

  const [file, setFile] = useState<any>();

  const [documentType, setDocumentType] = useState<DocumentType[]>([]);

  const defaultFormData = {
    documentName: "",
    documentDescription: "",
    documentTypeID: "",
    startDate: "",
    endDate: "",
    documentNotes: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const {
    documentName,
    documentDescription,
    documentTypeID,
    startDate,
    endDate,
    documentNotes,
  } = formData;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      //"id" and "name" of <elements> in <form> has to be same for this to work
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    // const formData = new FormData(event.target);

    const selectedDocumentTypeID = (document.querySelector('select')).value;
    console.log("Selected document type: ", selectedDocumentTypeID);

    const documentData: Document = {
      document_id: null,
      document_name: formData.documentName,
      document_description: formData.documentDescription,
      document_type_id: selectedDocumentTypeID,
      start_date: formData.startDate,
      end_date: formData.endDate,
      file_id: fileId,
      document_notes: formData.documentNotes,
      modified_by: "hardCodedTestUser",
      modified_date: new Date().toString(),
      org_id: "hardCodedOrgID",
      asset_id: assetID,
      location_id: locationID,
    };

    console.log("Document Data ==>> ", documentData);

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

    setFormData(defaultFormData);
  };

  // useEffect hook to retrieve the session token from localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = window.localStorage.getItem("sessionToken");
        const documentTypes = await getAllDocumentTypes(data);

        setToken(data);
        setDocumentType(documentTypes);
      } catch (error) {
        console.error(
          "Failed to fetch Session Token and Document Types:",
          error
        );
      }
    };

    fetchData();
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
          <form method="post" onSubmit={(e) => handleSubmit(e)}>
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
                id="documentName"
                name="documentName"
                value={documentName}
                onChange={(e) => handleChange(e)}
                required
                placeholder="Enter Document Name"
                className="input input-bordered input-sm text-sm w-full my-3 font-sans"
              />
              <label className="font-sans font-semibold text-sm text-black">
                Document Type
              </label>
              <select
                id="documentType"
                name="documentType"
                onChange={(e) => handleChange(e)}
                className="select select-sm my-3 w-full border border-slate-300"
                required
              >
                <option value="" disabled selected hidden>
                  Select Document Type
                </option>
                {documentType.map((documentType) => (
                  <option
                    key={documentType.document_type_id}
                    value={documentType.document_type_id}
                  >
                    {documentType.document_type}
                  </option>
                ))}
              </select>

              <div className="flex flex-row gap-2 my-3">
                <div className="flex flex-col">
                  <label className="font-sans font-semibold text-sm text-black">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => handleChange(e)}
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
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={(e) => handleChange(e)}
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
                id="documentDescription"
                name="documentDescription"
                value={documentDescription}
                onChange={(e) => handleChange(e)}
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
                id="file"
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
                id="documentNotes"
                name="documentNotes"
                value={documentNotes}
                onChange={(e) => handleChange(e)}
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
                <button
                  className={`btn bg-blue-900 gap-5 hover:bg-blue-900  capitalize`}
                  id="submit"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDocumentsForm;
