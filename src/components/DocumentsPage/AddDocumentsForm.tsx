import { useEffect, useState } from "react";
import { Document, DocumentType } from "types";
import { uploadFiletoS3 } from "utils";
import { toast } from "react-toastify";
import { createFile } from "services/fileServices";
import { createDocument } from "services/documentServices";
import { getAllDocumentTypes } from "services/documentTypeServices";
import { AiOutlinePaperClip } from "react-icons/ai";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddDocumentsForm = ({
  addDocumentsOpen,
  setAddDocumentsOpen,
  assetID = null,
  locationID = null,
}) => {
  // State Initialization
  const [file, setFile] = useState<any>();
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const queryClient = useQueryClient();

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

  // Function to handle form input changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Mutation function to add a new document
  const documentAddMutation = useMutation({
    mutationFn: (documentData: Document) =>
      createDocument(authTokenObj.authToken, documentData),
    onSettled: () => {
      toast.success("Document Added Successfully");
      setAddDocumentsOpen(false);
    },
    onSuccess: (res) => {
      console.log("Return from createDocument ==>> ", res);
      queryClient.invalidateQueries(["query-documentsByAssetId"]);
      queryClient.invalidateQueries(["query-documentsbyLocationId"]);
    },
    onError: (err: any) => {
      toast.error("Failed to Delete Asset");
    },
  });

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddDocumentsOpen(false);

    const modifiedBy = authTokenObj.attributes.given_name;
    const modifiedDate = new Date().toISOString().substring(0, 10);

    // Step 1: Upload the document to S3 bucket
    const documentLocation = await uploadFiletoS3(file, "document");
    console.log("documentLocation ==>> ", documentLocation);

    // Step 2: Register the uploaded file in the backend
    const createdFile = await createFile(authTokenObj.authToken, {
      file_id: null,
      file_array: [documentLocation.location],
      modified_by_array: [modifiedBy],
      modified_date_array: [modifiedDate],
    });
    const fileId = String(createdFile);

    // Step 3: Collect data for the new document
    const selectedDocumentTypeID = (
      document.querySelector("#documentType") as HTMLSelectElement
    ).value;
    const documentData: Document = {
      document_id: null,
      document_name: formData.documentName,
      document_description: formData.documentDescription,
      document_type_id: selectedDocumentTypeID,
      start_date: formData.startDate.toString(),
      end_date: formData.endDate.toString(),
      file_id: fileId,
      document_notes: formData.documentNotes,
      modified_by: modifiedBy,
      modified_date: new Date().toLocaleDateString(),
      org_id: null,
      asset_id: assetID,
      location_id: locationID,
      document_type: selectedDocumentTypeID,
    };

    // Step 4: Add the document to the backend
    try {
      documentAddMutation.mutateAsync(documentData);
    } catch (error) {
      console.error("Failed to create document:", error);
      toast.error("Failed to create document");
    }

    setFormData(defaultFormData);
  };

  // Function to fetch available document types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDocumentTypes = await getAllDocumentTypes(
          authTokenObj.authToken
        );
        setDocumentTypes(fetchedDocumentTypes);
      } catch (error) {
        console.error("Failed to fetch Document Types:", error);
      }
    };

    fetchData();
  }, []);

  // Function to close the form modal
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
      <div className="rounded-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-0 mb-5 w-full sm:mx-2">
          <form method="post" onSubmit={(e) => handleSubmit(e)}>
            {/* Modal header */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 flex flex-row">
              <h3 className="font-sans font-bold text-lg text-blue-800 dark:text-white">
                Add Document
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
              {/* Input field for asset name */}
              <label className="font-sans font-semibold text-black dark:text-white text-sm">
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
                className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
              />
              <label className="font-sans font-semibold text-sm text-black dark:text-white">
                Document Type
              </label>
              <select
                id="documentType"
                name="documentType"
                onChange={(e) => handleChange(e)}
                className="select select-sm my-3 text-black dark:text-white bg-transparent dark:border-gray-500 w-full border border-slate-300"
                required
              >
                <option value="" disabled selected hidden>
                  Select Document Type
                </option>
                {documentTypes.map((documentType) => (
                  <option
                    className="text-black bg-white dark:text-white dark:bg-gray-800"
                    key={documentType.document_type_id}
                    value={documentType.document_type_id}
                  >
                    {documentType.document_type}
                  </option>
                ))}
              </select>

              <div className="flex flex-row gap-2 my-3">
                <div className="flex flex-col">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => handleChange(e)}
                    required
                    className="font-sans font-semibold border text-sm text-black dark:text-white bg-white dark:sm:border-gray-500 dark:2xl:border-transparent dark:2xl:bg-transparent my-3"
                  />
                </div>
                <div className="flex flex-col ml-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => handleChange(e)}
                    required
                    className="font-sans font-semibold border text-sm text-black dark:text-white bg-white dark:sm:border-gray-500 dark:2xl:border-transparent dark:2xl:bg-transparent my-3"
                  />
                </div>
              </div>

              <label className="font-sans font-semibold text-sm text-black dark:text-white">
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
                className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
              />

              {/* File input for uploading an image */}
              <label
                htmlFor="file_input"
                className="font-sans font-semibold text-sm text-black dark:text-white"
              >
                Upload File
              </label>
              <input
                type="file"
                required
                id="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-md text-black dark:text-white border border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer bg-white dark:bg-transparent focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3"
              />
              {/* <input
                type="file"
                required
                id="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
              /> */}
              <div className="flex flex-row rounded-lg border border-gray-300 dark:border-gray-500 p-2 my-2 hidden">
                <input
                  type="text"
                  value={`${file ? file.name : "No file chosen"}`}
                  className={`bg-transparent text-sm font-sans w-4/5 md:w-1/2 ${
                    file && file
                      ? "text-black dark:text-white"
                      : "text-gray-400"
                  }`}
                />
                <button
                  className="btn btn-xs bg-transparent border border-gray-400 hover:border-gray-400 hover:bg-transparent normal-case font-normal w-fit text-blue-600 dark:text-white font-sans text-xs md:text-[9px] p-0.5 rounded-xl ml-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    const uploadButton = document.querySelector(
                      "#file"
                    ) as HTMLElement;
                    uploadButton.click();
                  }}
                >
                  <AiOutlinePaperClip className="text-lg" />
                  Choose File
                </button>
              </div>

              <label className="font-sans font-semibold text-sm text-black dark:text-white">
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
                className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
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
