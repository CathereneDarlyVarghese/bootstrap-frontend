import React, { useState, useEffect } from "react";
import { getAllDocumentTypes } from "services/documentTypeServices";
import { Document, DocumentType, File } from "types";
import { appendToFileArray, getFileById } from "services/fileServices";
import { uploadFiletoS3 } from "utils";
import { updateDocument } from "services/documentServices";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useQueryClient } from "@tanstack/react-query";

const EditDocumentsForm = ({
  open,
  close,
  document,
  fileStatus,
  documentStatus,
}) => {
  // QueryClient
  const queryClient = useQueryClient();
  // States
  const [file, setFile] = useState<any>(null);
  const [formData, setFormData] = useState<Document>({
    // Initializing formData with passed document properties
    ...document,
    modified_by: null,
    modified_date: null,
    org_id: null,
    document_type: null,
  });
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    String(formData.start_date).substring(0, 10)
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    String(formData.end_date).substring(0, 10)
  );
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const defaultDocumentFile: File = {
    file_id: "",
    file_array: [],
    modified_by_array: [],
    modified_date_array: [],
  };
  const [documentFile, setDocumentFile] = useState<File>(defaultDocumentFile);

  // useEffect: Fetch session token, document types, and document file when the component mounts
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fetchedDocumentTypes = await getAllDocumentTypes(
          authTokenObj.authToken
        );
        const fetchedDocumentFile = await getFileById(
          authTokenObj.authToken,
          document.file_id
        );

        setDocumentTypes(fetchedDocumentTypes);
        setDocumentFile(fetchedDocumentFile);
      } catch (error) {
        console.error(
          "Failed to fetch Session Token and Document Types:",
          error
        );
      }
    };

    fetchDetails();
  }, []);

  // Handlers
  const handleFormDataChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    setFormData((prevState) => {
      if (id === "start_date") {
        setSelectedEndDate(""); // Reset the selected end date
        return {
          ...prevState,
          [id]: value,
          end_date: "", // Reset the end date
        };
      }
      return {
        ...prevState,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (file) {
      // Upload the file to S3 and update the File object in the backend
      const documentLocation = await uploadFiletoS3(file, "document");
      const newFileArrayEntry: string = documentLocation.location;

      const newModifiedByArrayEntry = authTokenObj.attributes.given_name;
      const newModifiedDateArrayEntry = new Date()
        .toISOString()
        .substring(0, 10);

      const appendedFile = await appendToFileArray(
        authTokenObj.authToken,
        formData.file_id,
        newFileArrayEntry,
        newModifiedByArrayEntry,
        newModifiedDateArrayEntry
      );
    }

    try {
      // Update the document
      const updatedDocument = await updateDocument(
        authTokenObj.authToken,
        formData.document_id,
        formData
      );
      queryClient.invalidateQueries(["query-documentsByLocationId"]);
      queryClient.invalidateQueries(["query-documentsByAssetId"]);
      toast.success("Document Updated Successfully");
    } catch (error) {
      toast.error("Failed to update document");
    }
  };

  return (
    <>
      <input
        type="checkbox"
        checked={open}
        id="my_modal_6"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-h-full">
          {/* <form> */}
          <div className="flex flex-row">
            <h3 className="font-sans font-bold text-lg text-blue-800 dark:text-white">
              Edit Document
            </h3>
            <button onClick={close} className="ml-auto">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-blue-800 dark:text-white ml-auto cursor-pointer"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
          <div className="my-3">
            <form method="post" onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col p-5">
                {/* Input field for asset name */}
                <label className="font-sans font-semibold text-black dark:text-white text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="document_name"
                  name="document_name"
                  value={formData.document_name}
                  onChange={(e) => {
                    handleFormDataChange(e);
                  }}
                  required
                  placeholder="Enter Document Name"
                  className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                />
                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                  Document Type
                </label>
                <select
                  id="document_type_id"
                  name="document_type_id"
                  value={formData.document_type_id}
                  onChange={(e) => handleFormDataChange(e)}
                  className="select select-sm my-3 text-black dark:text-white bg-transparent dark:border-gray-500 w-full border border-slate-300"
                  required
                >
                  {documentTypes.map((documentTypes) => (
                    <option
                      className="text-black bg-white dark:text-white dark:bg-gray-800"
                      key={documentTypes.document_type}
                      value={documentTypes.document_type_id}
                    >
                      {documentTypes.document_type}
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
                      id="start_date"
                      name="start_date"
                      defaultValue={String(formData.start_date).substring(
                        0,
                        10
                      )}
                      onChange={(e) => {
                        handleFormDataChange(e);
                        setSelectedStartDate(e.target.value);
                      }}
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
                      id="end_date"
                      name="end_date"
                      min={selectedStartDate}
                      // defaultValue={String(formData.end_date).substring(0, 10)}
                      value={selectedEndDate}
                      onChange={(e) => {
                        handleFormDataChange(e);
                        setSelectedEndDate(e.target.value);
                      }}
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
                  id="document_description"
                  name="document_description"
                  value={formData.document_description}
                  onChange={(e) => {
                    handleFormDataChange(e);
                  }}
                  placeholder="Enter Description"
                  className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                />

                {/* File input for uploading an image */}
                <label
                  htmlFor="file_input"
                  className="font-sans font-semibold text-sm text-black dark:text-white"
                >
                  Add a New File
                  <h1
                    className="text-xs text-blue-800 underline"
                    onClick={() =>
                      window.open(
                        documentFile.file_array[
                          documentFile.file_array.length - 1
                        ][0],
                        "_blank"
                      )
                    }
                  >
                    {`(Latest File: ${
                      documentFile.file_array.length > 0
                        ? String(
                            documentFile.file_array[
                              documentFile.file_array.length - 1
                            ][0]
                          ).substring(51)
                        : ""
                    })`}
                  </h1>
                </label>
                <input
                  type="file"
                  required
                  id="file"
                  name="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-md text-black dark:text-white border border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer bg-white dark:bg-transparent focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3"
                />
                {/* file upload same as desing. (not working now) */}
                {/* <input
                  type="file"
                  required
                  id="file"
                  name="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-md text-white border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3 hidden"
                /> */}
                {/* <div className="flex flex-row rounded-lg border border-gray-300 dark:border-gray-500 p-2 my-2">
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
                      className="btn btn-xs bg-transparent border border-gray-400 hover:border-gray-400 hover:bg-transparent normal-case font-normal w-fit border text-blue-600 dark:text-white font-sans text-xs md:text-[9px] p-0.5  rounded-xl ml-auto"
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
                  </div> */}

                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                  Notes
                </label>
                <input
                  type="text"
                  id="document_notes"
                  name="document_notes"
                  value={formData.document_notes}
                  onChange={(e) => {
                    handleFormDataChange(e);
                  }}
                  placeholder="Enter Description"
                  // onChange={(e) =>
                  //   setData((curr) => ({ ...curr, name: e.target.value }))
                  // }
                  // value={data.name}
                  className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                />
              </div>
            </form>
          </div>
          <div className="flex flex-row justify-center">
            <button
              className="btn btn-sm bg-blue-900 hover:bg-blue-800"
              onClick={(e) => {
                handleSubmit(e);
                close();
              }}
            >
              Submit
            </button>
          </div>
          {/* </form> */}
        </div>
      </div>
    </>
  );
};

export default EditDocumentsForm;
