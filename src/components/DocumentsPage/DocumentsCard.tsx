import { useState, useEffect } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiFillExclamationCircle } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { TiArrowBackOutline } from "react-icons/ti";
import { MdAutorenew } from "react-icons/md";
import {
  AiOutlineDelete,
  AiOutlineHistory,
  AiOutlineEdit,
} from "react-icons/ai";
import { BsFillXCircleFill } from "react-icons/bs";
import documentIcon from "../../icons/documentIcon.svg";
import { Auth } from "aws-amplify";
import { getDocumentTypeById } from "services/documentTypeServices";
import { getFileById } from "services/fileServices";
import { deleteDocument } from "services/documentServices";
import { toast } from "react-toastify";
import EditDocumentsForm from "./EditDocumentsForm";
import ReplaceExistingFileForm from "./ReplaceExistingFileForm";
import { File } from "types";
import AddNewFileForm from "./AddNewFileForm";

const DocumentsCard = ({
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
  locationID,
}) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const defaultDocumentFile: File = {
    file_id: "",
    file_array: [],
    modified_by_array: [],
    modified_date_array: [],
  };
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File>(defaultDocumentFile);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [replaceFileForm, setReplaceFileForm] = useState(false);
  const [addFileForm, setAddFileForm] = useState(false);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.accessToken.jwtToken);

        const fetchedDocumentType = await getDocumentTypeById(
          userData.signInUserSession.accessToken.jwtToken,
          documentTypeID
        );

        setDocumentType(fetchedDocumentType.document_type);

        const fetchedDocumentFile = await getFileById(
          userData.signInUserSession.accessToken.jwtToken,
          fileID
        );

        // setFileName((fetchedFile.file_array[0]));
        console.log("Fetched File ==>> ", fetchedDocumentFile);
        setDocumentFile(fetchedDocumentFile);

        // console.log("Document Type ==>> ", documentType);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDocumentDetails();
  }, []);

  // console.log("Selected Document Type ==>> ", documentType);
  // console.log("Session Token ==>> ", sessionToken);

  const deleteSelectedDocument = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setSessionToken(userData.signInUserSession.accessToken.jwtToken);

      await deleteDocument(
        userData.signInUserSession.accessToken.jwtToken,
        documentID
      );
      toast.success("Document Deleted Successfully!", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Failed to delete document: ", error);
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

  // Latest Document and Document History Table Data
  const fileArray = documentFile.file_array.slice(0).reverse();
  const modifiedByArray = documentFile.modified_by_array.slice(0).reverse();
  const modifiedDateArray = documentFile.modified_date_array.slice(0).reverse();
  let maxLength = Math.max(
    fileArray.length,
    modifiedByArray.length,
    modifiedDateArray.length
  );
  const tableRows = [];

  for (let i = 0; i < maxLength; i++) {
    let serialNumber = maxLength - i;
    const file = fileArray[i] ? fileArray[i][0] : "Null";
    const modifiedBy = modifiedByArray[i] ? modifiedByArray[i] : "Null";
    const modifiedDate = modifiedDateArray[i] ? modifiedDateArray[i] : "Null";

    tableRows.push(
      <tr key={i}>
        <td>{serialNumber}</td>
        <td
          className="flex flex-row gap-1 text-blue-800 underline"
          onClick={() => window.open(file, "_blank")}
        >
          <img src={documentIcon} />
          {String(file).substring(51)}
        </td>
        <td>{modifiedBy}</td>
        <td>{modifiedDate}</td>
      </tr>
    );
  }

  return (
    <>
      {showHistory ? (
        <div
          className="card bg-white dark:bg-gray-800 p-5"
          style={{ height: "fit-content" }}
        >
          <div className="flex flex-row-reverse md:flex-col">
            <div className="ml-auto mb-3 flex flex-row md:ml-0 gap-4 items-center">
              <div className="mr-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
                <div>
                  <h1 className="text-black dark:text-white font-semibold font-sans text-md md:text-sm md:font-medium">
                    Start Date:
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-md md:text-sm">
                  <AiOutlineCalendar className="text-xl text-blue-900 dark:text-gray-400" />
                  <h1 className="text-blue-900 dark:text-gray-400 font-sans font-semibold text-md md:text-xs md:font-medium">
                    {startDate.substring(0, 10)}
                  </h1>
                </div>
              </div>
              <div className="ml-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
                <div>
                  <h1 className="text-black dark:text-white font-semibold font-sans text-md md:text-sm md:font-medium">
                    End Date:
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-md md:text-sm">
                  <AiOutlineCalendar className="text-xl text-blue-900 dark:text-gray-400" />
                  <h1 className="text-blue-900 dark:text-gray-400 font-sans font-semibold text-md md:text-xs md:font-medium">
                    {endDate.substring(0, 10)}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <h1 className="text-black dark:text-white text-lg font-semibold font-sans md:w-1/2">
                {documentName}
              </h1>
              <div
                className={
                  "badge bg-blue-200 border-none font-semibold text-blue-900 md:text-[10px] p-3 md:p-2 md:ml-auto"
                }
              >
                {documentType}
              </div>
            </div>
          </div>
          <div>
            <h1 className="font-sans">Document History</h1>
            <div
              className="flex flex-row gap-2 items-center my-3 "
              onClick={() => {
                console.log("clicked");
              }}
            >
              {/* Document History */}
              {tableRows.length === 1 ? (
                <p className="text-xl text-slate-400">Unavailable</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>File Name</th>
                        <th>Modified By</th>
                        <th>Modified Date</th>
                      </tr>
                    </thead>
                    <tbody>{tableRows.slice(1)}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          {/* Show files history above this section */}
          <div className="ml-auto">
            <button onClick={() => setShowHistory(false)}>
              <TiArrowBackOutline className="text-blue-900 text-2xl" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="card bg-white dark:bg-gray-800 p-5"
          style={{ height: "fit-content" }}
        >
          <div className="flex flex-row-reverse md:flex-col">
            <div className="ml-auto mb-3 flex flex-row md:ml-0 gap-4 items-center">
              <div className="mr-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
                <div>
                  <h1 className="text-black dark:text-white font-semibold font-sans text-md md:text-sm md:font-medium">
                    Start Date:
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-md md:text-sm">
                  <AiOutlineCalendar className="text-xl text-blue-900 dark:text-gray-400" />
                  <h1 className="text-blue-900 dark:text-gray-400 font-sans font-semibold text-md md:text-xs md:font-medium">
                    {startDate.substring(0, 10)}
                  </h1>
                </div>
              </div>
              <div className="ml-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
                <div>
                  <h1 className="text-black dark:text-white font-semibold font-sans text-md md:text-sm md:font-medium">
                    End Date:
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-md md:text-sm">
                  <AiOutlineCalendar className="text-xl text-blue-900 dark:text-gray-400" />
                  <h1 className="text-blue-900 dark:text-gray-400 font-sans font-semibold text-md md:text-xs md:font-medium">
                    {endDate.substring(0, 10)}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <h1 className="text-black dark:text-white text-lg font-semibold font-sans md:w-1/2">
                {documentName}
              </h1>
              <div
                className={
                  "badge bg-blue-200 border-none font-semibold text-blue-900 md:text-[10px] p-3 md:p-2 md:ml-auto"
                }
              >
                {documentType}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-400">{documentDescription}</p>
          </div>
          <div className="mt-2 flex flex-row">
            <div className="mr-1">
              <h1 className="text-black dark:text-white font-sans font-semibold">
                Note:
              </h1>
              <div>
                <p className="text-gray-400">{documentNotes}</p>
              </div>
            </div>
            <div className="ml-auto">
              <div className="flex flex-row md:flex-col gap-1 md:gap-2">
                <button
                  title="Edit Document"
                  onClick={() => setEditFormOpen(true)}
                >
                  <AiOutlineEdit className="text-2xl text-blue-900 dark:text-white" />
                </button>
                <button
                  title="Document History"
                  onClick={() => setShowHistory(true)}
                >
                  <AiOutlineHistory className="text-2xl text-blue-900 dark:text-white" />
                </button>
                <button
                  title="Delete Document"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        "Are you sure you want to delete this document?"
                      )
                    ) {
                      deleteSelectedDocument();
                    }
                    console.log("Delete document button clicked");
                  }}
                >
                  <AiOutlineDelete className="text-2xl text-blue-900 dark:text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-row md:flex-col gap-5 items-center">
            <div
              className="flex flex-row gap-2  items-center md:mr-auto w-full"

              onClick={() => {
                console.log("clicked");
              }}
            >
              {/* Display Latest Entry in file table */}
              {tableRows.length === 0 ? (
                <p className="text-xl text-slate-400">Unavailable</p>
              ) : (
                <div className="overflow-x-auto w-full inline-block">
                  <table className="table table-zebra">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>File Name</th>
                        <th>Modified By</th>
                        <th>Modified Date</th>
                      </tr>
                    </thead>
                    <tbody>{tableRows[0]}</tbody>
                  </table>
                </div>
              )}
            </div>
            {/* <div className="flex flex-row gap-2 items-center sm:ml-auto">
              {fileStatus === "File Uploaded" ? (
                <>
                  <BsFillCheckCircleFill className="text-lg text-green-500" />
                  <h1 className="font-sans text-green-500 text-md md:text-xs">
                    {fileStatus}
                  </h1>
                </>
              ) : (
                <>
                  <BsFillXCircleFill className="text-lg text-red-500" />
                  <h1 className="font-sans text-red-500 text-md md:text-xs">
                    {fileStatus}
                  </h1>
                </>
              )}
            </div> */}
            <div className="md:w-full">
              <button
                className="btn btn-sm bg-blue-900 hover:bg-blue-900 normal-case font-sans w-full"
                onClick={() => setReplaceFileForm(true)}
              >
                <div className="flex flex-row items-center gap-2">
                  <MdAutorenew className="text-lg" />
                  <p>Replace Exisiting File</p>
                </div>
              </button>
            </div>
            <div className="md:w-full">
              <button
                className="btn btn-sm bg-green-600 hover:bg-green-600 border-0 normal-case font-sans w-full"
                onClick={() => setAddFileForm(true)}
              >
                <div className="flex flex-row items-center gap-2">
                  <AiFillPlusCircle />
                  <p>Add a New File</p>
                </div>
              </button>
            </div>
            <div className="ml-auto">
              {documentStatus === "active" ? (
                <BsFillCheckCircleFill className="text-green-600 text-3xl md:text-2xl " />
              ) : documentStatus === "expiring soon" ? (
                <AiFillExclamationCircle className="text-yellow-600 text-3xl md:text-2xl" />
              ) : (
                <BsFillXCircleFill className="text-red-600 text-3xl md:text-2xl" />
              )}
              {/* <AiFillExclamationCircle className="text-yellow-600 text-3xl md:text-2xl" /> */}
            </div>
          </div>
          <div>
            <EditDocumentsForm
              open={editFormOpen}
              close={() => setEditFormOpen(false)}
              documentID={documentID}
              documentName={documentName}
              documentDescription={documentDescription}
              documentTypeID={documentTypeID}
              startDate={startDate}
              endDate={endDate}
              documentNotes={documentNotes}
              fileStatus={fileStatus}
              documentStatus={documentStatus}
              fileID={fileID}
              assetID={assetID}
              locationID={locationID}
            />
          </div>
          <div>
            <ReplaceExistingFileForm
              fileID={fileID}
              open={replaceFileForm}
              closeForm={() => setReplaceFileForm(false)}
            />
          </div>
          <div>
            <AddNewFileForm
              fileID={fileID}
              open={addFileForm}
              closeForm={() => setAddFileForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentsCard;
