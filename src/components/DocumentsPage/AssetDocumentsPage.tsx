import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";
import { getDocumentsByAssetId } from "services/documentServices";
import { Document, IncomingDocument } from "types";
import DisplayDocument from "./DisplayDocument";

const AssetDocumentsPage = ({ selectedAsset }) => {
  const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  const selectedAssetID = selectedAsset.asset_id;

  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [incomingDocuments, setIncomingDocuments] = useState<
    IncomingDocument[]
  >([]); //This is because the fetched documents are a mixture from documents and document_types tables
  const [documentID, setDocumentID] = useState(null);
  const [fileOpen, setFileOpen] = useState(false);

  console.log("The selected asset ID (1) ==>>", selectedAssetID);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.accessToken.jwtToken);
        const documentsData = await getDocumentsByAssetId(
          userData.signInUserSession.accessToken.jwtToken,
          selectedAssetID
        );
        setIncomingDocuments(documentsData);
        console.log("The selected asset ID (2) ==>>", selectedAssetID);
        console.log("The fetched documents ==>>", documentsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocuments();
  }, [selectedAssetID]);

  return (
    <>
      <div
        className={`h-full overflow-y-auto p-5 pb-20 ${
          addDocumentsOpen && !fileOpen
            ? "2xl:bg-white dark:2xl:bg-gray-800 xl:bg-white dark:xl:bg-gray-800"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        <div
          className={`flex flex-grow items-center ${
            addDocumentsOpen && !fileOpen ? "xl:hidden" : ""
          } `}
        >
          <h1 className="text-blue-800 dark:text-blue-700 text-xl font-sans font-semibold">
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
            className={`${
              addDocumentsOpen
                ? "w-3/5 hidden"
                : fileOpen
                ? "w-3/5 hidden"
                : !fileOpen
                ? "w-full"
                : "w-full"
            }`}
          >
            {incomingDocuments.map((document) => (
              <div
                className="border border-gray-300 dark:border-gray-600 rounded-xl"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setDocumentID(document.document_id);
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
                  // FIX THIS - For now we are only displaying one file name
                  fileID={document.file_id}
                  fileOpen={fileOpen}
                  setFileOpen={setFileOpen}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          className={`border border-gray-300 dark:border-gray-600 rounded-xl ${
            addDocumentsOpen && !fileOpen ? "w-full" : "hidden"
          }`}
        >
          <AddDocumentsForm
            addDocumentsOpen={addDocumentsOpen}
            setAddDocumentsOpen={setAddDocumentsOpen}
            assetID={selectedAssetID}
            // locationID={selectedLocation}
          />
        </div>
        {/* display file */}
        <div
          className={`border border-gray-300 dark:border-gray-600 rounded-xl ${
            fileOpen && !addDocumentsOpen ? "w-full" : "hidden"
          }`}
        >
          <DisplayDocument
            fileName={"Document name"}
            closeFile={() => {
              setFileOpen(false);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AssetDocumentsPage;
