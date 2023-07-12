import React, { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import { AiOutlinePaperClip } from "react-icons/ai";
import { getAllDocumentTypes } from "services/documentTypeServices";
import { Document, DocumentType, File } from "types";
import { appendToFileArray, getFileById } from "services/fileServices";
import { uploadFiletoS3 } from "utils";
import { updateDocument } from "services/documentServices";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";

const EditDocumentsForm = ({
  open,
  close,
  documentID,
  documentName,
  documentDescription,
  documentTypeID,
  startDate,
  endDate,
  documentNotes,
  fileStatus,
  documentStatus,
  fileID,
  assetID,
  locationID
}) => {
  const [file, setFile] = useState<any>(null);
  const [formData, setFormData] = useState<Document>({
    document_id: documentID,
    document_name: documentName,
    document_description: documentDescription,
    document_type_id: documentTypeID,
    start_date: startDate,
    end_date: endDate,
    file_id: fileID,
    document_notes: documentNotes,
    modified_by: null,
    modified_date: null,
    org_id: null,
    asset_id: assetID,
    location_id: locationID,
    document_type: null
  });
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    formData.start_date
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    formData.end_date
  );
  const defaultDocumentFile: File = { file_id: "", file_array: [], modified_by_array: [], modified_date_array: [] };
  const [documentFile, setDocumentFile] = useState<File>(defaultDocumentFile);

  // useEffect hook to retrieve the session token from localStorage
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = window.localStorage.getItem("sessionToken");
        const fetchedDocumentTypes = await getAllDocumentTypes(data);
        const fetchedDocumentFile = await getFileById(data, fileID);

        setDocumentTypes(fetchedDocumentTypes);
        setDocumentFile(fetchedDocumentFile);

        console.log("Form Data Document Name ==>> ", formData.file_id);
      } catch (error) {
        console.error(
          "Failed to fetch Session Token and Document Types:",
          error
        );
      }
    };

    fetchDetails();
  }, []);

  const handleFormDataChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(e.target.value);

    setFormData((prevState) => ({
      ...prevState,
      //"id" and "name" of <elements> in <form> has to be same for this to work
      [e.target.id]: e.target.value,
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStartDate(e.target.value);

    setFormData((prevState) => ({
      ...prevState,
      start_date: e.target.value,
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndDate(e.target.value);

    setFormData((prevState) => ({
      ...prevState,
      end_date: e.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const userData = await Auth.currentAuthenticatedUser();
    const token = userData.signInUserSession.accessToken.jwtToken;

    if (file) {
      // Step 1: Obtain file location (link) from S3 bucket
      const documentLocation = await uploadFiletoS3(file, "document");
      console.log("documentLocation ==>> ", documentLocation);

      const newFileArrayEntry: string = documentLocation.location;
      console.log("newFileArrayEntry ==>> ", newFileArrayEntry);

      const newModifiedByArrayEntry = userData.attributes.given_name;
      const newModifiedDateArrayEntry = String(new Date()).substring(0, 10);

      // Step 2: Append this file location into file_array of existing File object in the backend
      const appendedFile = await appendToFileArray(
        token,
        formData.file_id,
        newFileArrayEntry,
        newModifiedByArrayEntry,
        newModifiedDateArrayEntry
      );
      console.log(
        "Return from appendFile (Success/Error Message) ==>> ",
        appendedFile
      );
    }
    try {
      const updatedDocument = await updateDocument(
        token,
        formData.document_id,
        formData
      );
      console.log("Updated Document:", updatedDocument);
      toast.success("Document Updated Successfully", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // setAddDocumentsOpen(false);
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("Failed to update document", {
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

    // setFormData(defaultDocumentFile);
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
                        onChange={(e) => handleStartDateChange(e)}
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
                        defaultValue={String(formData.end_date).substring(0, 10)}
                        onChange={(e) => handleEndDateChange(e)}
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
                onClick={(e) => {handleSubmit(e)
                close()}}
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
