import { useState, useEffect } from "react";
import {
  AiOutlineCalendar,
  AiFillExclamationCircle,
  AiFillPlusCircle,
  AiOutlineDelete,
  AiOutlineHistory,
  AiOutlineEdit,
} from "react-icons/ai";
import { BsFillCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { TiArrowBackOutline } from "react-icons/ti";
import { MdAutorenew } from "react-icons/md";
import { getDocumentTypeById } from "services/documentTypeServices";
import { getFileById } from "services/fileServices";
import { deleteDocument } from "services/documentServices";
import { toast } from "react-toastify";
import { IncomingDocument, dubeFile } from "types";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditDocumentsForm from "./EditDocumentsForm";
import ReplaceExistingFileForm from "./ReplaceExistingFileForm";
import AddNewFileForm from "./AddNewFileForm";
import documentIcon from "../../icons/documentIcon.svg";

interface DocumentsCardProps {
  document: IncomingDocument;
  fileStatus: string;
  documentStatus: string;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({
  document,
  fileStatus,
  documentStatus,
}) => {
  // States
  const [documentType, setDocumentType] = useState<string | null>(null);
  const defaultDocumentFile: dubeFile = {
    file_id: "",
    file_array: [],
    modified_by_array: [],
    modified_date_array: [],
  };
  const [documentFile, setDocumentFile] = useState<dubeFile>(defaultDocumentFile);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [replaceFileForm, setReplaceFileForm] = useState(false);
  const [addFileForm, setAddFileForm] = useState(false);

  // Hooks and external data
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const queryClient = useQueryClient();

  // Fetch document details on component mount
  const fetchDocumentDetails = async () => {
    const fetchedDocumentType = await getDocumentTypeById(
      authTokenObj.authToken,
      document.document_type_id,
    );

    const fetchedDocumentFile = await getFileById(
      authTokenObj.authToken,
      document.file_id,
    );

    return { fetchedDocumentType, fetchedDocumentFile };
  };

  const { data } = useQuery({
    queryKey: ["fetch-document-details", document],
    queryFn: fetchDocumentDetails,
    enabled: !!authTokenObj,
  });

  useEffect(() => {
    if (data) {
      setDocumentType(data.fetchedDocumentType.document_type);
      setDocumentFile(data.fetchedDocumentFile);
    }
  }, [data]);

  // Mutation for deleting the selected document
  const deleteSelectedDocument = useMutation({
    mutationFn: () => deleteDocument(authTokenObj.authToken, document.document_id),
    onSettled: () => {
      toast.info("Document Deleted Successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["query-documentsByLocationId"]);
      queryClient.invalidateQueries(["query-documentsByAssetId"]);
    },
    onError: () => {
      toast.error("Failed to Delete Document");
    },
  });

  // Create the table data for the latest document and document history
  const fileArray = documentFile.file_array.slice(0).reverse();
  const modifiedByArray = documentFile.modified_by_array.slice(0).reverse();
  const modifiedDateArray = documentFile.modified_date_array.slice(0).reverse();
  const maxLength = Math.max(
    fileArray.length,
    modifiedByArray.length,
    modifiedDateArray.length,
  );
  const tableRows = [];
  for (let i = 0; i < maxLength; i += 1) {
    const serialNumber = maxLength - i;
    const file = fileArray[i] ? fileArray[i] : "Null";
    const modifiedBy = modifiedByArray[i] ? modifiedByArray[i] : "Null";
    const modifiedDate = modifiedDateArray[i] ? modifiedDateArray[i] : "Null";
    tableRows.push(
      <tr key={i}>
        <td>{serialNumber}</td>
        <td
          className="flex flex-row gap-1 text-blue-800 underline"
          onClick={() => window.open(file, "_blank")}
        >
          <img src={documentIcon} alt="Document Icon" />
          {String(file).substring(66)}
        </td>
        <td>{modifiedBy}</td>
        <td>{modifiedDate}</td>
      </tr>,
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
                    {document.start_date
                      ? document.start_date.substring(0, 10)
                      : "Not Available"}
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
                    {document.end_date
                      ? document.end_date.substring(0, 10)
                      : "Not Available"}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <h1 className="text-black dark:text-white text-lg font-semibold font-sans md:w-1/2">
                {document.document_name
                  ? document.document_name
                  : "Not Available"}
              </h1>
              <div
                className={`badge bg-blue-200 border-none font-semibold text-blue-900 md:text-[10px] p-3 md:p-2 md:ml-auto mr-2 ${
                  documentType && documentType.length > 15
                    ? "text-[10px] w-40"
                    : "text-md"
                }`}
              >
                {documentType || "Not Available"}
              </div>
            </div>
          </div>
          <div>
            <h1 className="font-sans">Document History</h1>
            <div className="flex flex-row gap-2 items-center my-3 ">
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
                  <h1 className="text-black dark:text-white font-semibold font-sans text-sm md:text-sm md:font-medium">
                    Start Date:
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md p-2">
                  <AiOutlineCalendar className="text-xl text-blue-900 dark:text-gray-400" />
                  <h1 className="text-blue-900 dark:text-gray-400 font-sans font-semibold text-sm md:text-xs md:font-medium">
                    {document.start_date
                      ? document.start_date.substring(0, 10)
                      : "Not Available"}
                  </h1>
                </div>
              </div>
              <div className="ml-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
                <div>
                  <h1 className="text-black dark:text-white font-semibold font-sans text-sm md:text-sm md:font-medium">
                    End Date:
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-md md:text-sm">
                  <AiOutlineCalendar className="text-xl text-blue-900 dark:text-gray-400" />
                  <h1 className="text-blue-900 dark:text-gray-400 font-sans font-semibold text-md md:text-xs md:font-medium">
                    {document.end_date
                      ? document.end_date.substring(0, 10)
                      : "Not Available"}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <h1 className="text-black dark:text-white text-lg font-semibold font-sans md:w-1/2">
                {document.document_name
                  ? document.document_name
                  : "Not Available"}
              </h1>
              <div
                className={`badge bg-blue-200 border-none font-semibold text-blue-900 md:text-[10px] p-3 md:p-2 md:ml-auto mr-2 ${
                  documentType && documentType.length > 15
                    ? "text-[10px] w-40"
                    : "text-md"
                }`}
              >
                {documentType || "Not Available"}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-400">
              {document.document_description
                ? document.document_description
                : "Not Available"}
            </p>
          </div>
          <div className="mt-2 flex flex-row">
            <div className="mr-1">
              <h1 className="text-black dark:text-white font-sans font-semibold">
                Note:
              </h1>
              <div>
                <p className="text-gray-400">
                  {document.document_notes
                    ? document.document_notes
                    : "Not Available"}
                </p>
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
                      // eslint-disable-next-line
                      window.confirm(
                        "Are you sure you want to delete this document?",
                      )
                    ) {
                      deleteSelectedDocument.mutateAsync();
                    }
                  }}
                >
                  <AiOutlineDelete className="text-2xl text-blue-900 dark:text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col lg:flex-col gap-5 ">
            <div className="flex flex-row gap-2 items-center md:mr-auto lg:w-full">
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
            <div className="flex flex-row md:flex-col gap-5">
              <div className="lg:w-full">
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
              <div className="lg:w-full">
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
              document={document}
              fileStatus={fileStatus}
              documentStatus={documentStatus}
            />
          </div>
          <div>
            <ReplaceExistingFileForm
              fileID={document.file_id}
              open={replaceFileForm}
              closeForm={() => setReplaceFileForm(false)}
            />
          </div>
          <div>
            <AddNewFileForm
              fileID={document.file_id}
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
