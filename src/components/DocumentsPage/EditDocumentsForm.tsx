import React, { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import { AiOutlinePaperClip } from "react-icons/ai";
import { getAllDocumentTypes } from "services/documentTypeServices";
import { DocumentType } from "types";

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
}) => {
  const [file, setFile] = useState<any>();
  const [formData, setFormData] = useState({
    documentID: documentID,
    documentName: documentName,
    documentDescription: documentDescription,
    documentTypeID: documentTypeID,
    startDate: startDate,
    endDate: endDate,
    documentNotes: documentNotes,
    fileStatus: fileStatus,
    documentStatus: documentStatus,
    fileID: fileID,
  });
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  // useEffect hook to retrieve the session token from localStorage
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const data = window.localStorage.getItem("sessionToken");
        const documentTypes = await getAllDocumentTypes(data);

        setDocumentTypes(documentTypes);
      } catch (error) {
        console.error(
          "Failed to fetch Session Token and Document Types:",
          error
        );
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleFormDataChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    console.log("e.target.value ==>> ", e.target.value);

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // Perform form submission logic here
  //     console.log('Form data:', formData);
  //     // Reset the form data if needed
  //     setFormData({
  //       documentName: '',
  //       // Reset other form fields as needed
  //     });
  //   };

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
          <div className="flex flex-row">
            <h3 className="font-sans font-bold text-lg text-blue-800 dark:text-white">
              Edit Document
            </h3>
            <button onClick={close} className="ml-auto">
              <TfiClose className="text-blue-800" />
            </button>
          </div>
          <div className="my-3">
            <form>
              <div className="flex flex-col p-5">
                {/* Input field for asset name */}
                <label className="font-sans font-semibold text-black dark:text-white text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="documentName"
                  name="documentName"
                  value={formData.documentName}
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
                  id="documentTypeID"
                  name="documentTypeID"
                  value={formData.documentTypeID}
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
                      id="startDate"
                      name="startDate"
                      value={Date.parse(formData.startDate)}
                      onChange={(e) => handleFormDataChange(e)}
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
                      value={Date.parse(formData.endDate)}
                      onChange={(e) => handleFormDataChange(e)}
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
                  value={formData.documentDescription}
                  onChange={(e) => {
                    handleFormDataChange(e);
                  }}
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
                  className="block w-full text-md text-white border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3 hidden"
                />
                <div className="flex flex-row rounded-lg border border-gray-300 dark:border-gray-500 p-2 my-2">
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
                </div>

                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                  Notes
                </label>
                <input
                  type="text"
                  id="documentNotes"
                  name="documentNotes"
                  value={formData.documentNotes}
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
              onClick={close}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDocumentsForm;
