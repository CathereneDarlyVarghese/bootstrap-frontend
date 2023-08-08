import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { locationAtom, useSyncedAtom } from "store/locationStore";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";
import { getDocumentsByLocationIdOnly } from "services/documentServices";
import { IncomingDocument, File } from "types";
import { getFileById } from "services/fileServices";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useQuery } from "react-query";

const DocumentsPage = () => {
  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);
  const [location] = useSyncedAtom(locationAtom);
  const [incomingDocuments, setIncomingDocuments] = useState<
    IncomingDocument[]
  >([]);
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [getResult, setGetResult] = useState<string | null>(null);
  const formatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };

  const defaultDocument = {
    document_id: "",
    document_name: "",
    document_description: "",
    document_type_id: "",
    start_date: "",
    end_date: "",
    file_id: "",
    document_notes: "",
    modified_by: "",
    modified_date: "",
    org_id: "",
    asset_id: "",
    location_id: "",
    document_type: "",
  };
  const [selectedDocument, setSelectedDocument] =
    useState<IncomingDocument>(defaultDocument);

  //display file
  const [fileOpen] = useState(false);
  const [, setFileName] = useState<string>(null);

  const selectedLocation = location.locationId;

  const { refetch: fetchDocuments } = useQuery<IncomingDocument[], Error>(
    "query-documents",
    async () => {
      return await getDocumentsByLocationIdOnly(
        authTokenObj.authToken,
        location.locationId
      );
    },
    {
      enabled: true,
      onSuccess: (res) => {
        setIncomingDocuments(res);
      },
      onError: (err: any) => {
        setGetResult(formatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    fetchDocuments();
  }, [location]);

  const { refetch: fetchFile } = useQuery<File, Error>(
    "query-files",
    async () => {
      return await getFileById(
        authTokenObj.authToken,
        selectedDocument.file_id
      );
    },
    {
      enabled: true,
      onSuccess: (res) => {
        const fileName =
          res.file_array && res.file_array[0] ? res.file_array[0] : "";
        setFileName(fileName);
      },
      onError: (err: any) => {
        setGetResult(formatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    fetchFile();
  }, [selectedDocument]);

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <>
      <div
        className={`h-full overflow-y-auto p-5 pb-20 ${
          addDocumentsOpen && !fileOpen
            ? "2xl:bg-gray-200 dark:2xl:bg-black xl:bg-white dark:xl:bg-gray-800"
            : "bg-gray-200 dark:bg-black"
        }`}
      >
        <div
          className={`flex flex-grow items-center ${
            addDocumentsOpen && !fileOpen ? "xl:hidden" : ""
          } `}
        >
          <h1 className="text-blue-800 text-xl font-sans font-semibold">
            Documents
          </h1>
          <button
            className="btn btn-sm bg-blue-900 hover:bg-blue-900 capitalize w-32 ml-auto"
            onClick={() => {
              setAddDocumentsOpen(true);
            }}
          >
            +Add
          </button>
        </div>
        <div
          className={`flex ${
            addDocumentsOpen || fileOpen ? "flex-row" : "flex-col"
          } items-start gap-2 mt-5`}
        >
          <div
            // className={`${addDocumentsOpen ? "w-3/5 xl:hidden" : "w-full"}`}
            className={`${
              addDocumentsOpen
                ? "w-3/5 xl:hidden"
                : fileOpen
                ? "w-2/5 xl:hidden"
                : !fileOpen
                ? "w-full"
                : "w-full"
            }`}
          >
            {incomingDocuments.map((document) => (
              <div
                className="cursor-pointer mb-5"
                onClick={() => {
                  setSelectedDocument(document);
                  console.log("File array ==>> ", document.file_id);
                  console.log("File ID ==>> ", selectedDocument.file_id);
                }}
              >
                <DocumentsCard
                  documentID={document.document_id}
                  documentName={document.document_name}
                  documentDescription={document.document_description}
                  documentTypeID={document.document_type_id}
                  startDate={document.start_date}
                  endDate={document.end_date}
                  documentNotes={document.document_notes}
                  fileStatus="File Uploaded"
                  documentStatus="active"
                  fileID={document.file_id}
                  assetID={document.asset_id}
                  locationID={document.location_id}
                />
              </div>
            ))}
          </div>
          <div
            className={`${
              addDocumentsOpen && !fileOpen ? "w-2/5 xl:w-full" : "hidden"
            }`}
          >
            <AddDocumentsForm
              addDocumentsOpen={addDocumentsOpen}
              setAddDocumentsOpen={setAddDocumentsOpen}
              locationID={selectedLocation}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentsPage;
