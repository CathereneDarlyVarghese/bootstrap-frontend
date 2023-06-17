import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";
import { getDocumentsByAssetId } from "services/documentServices";
import { Document, IncomingDocument } from "types";

const AssetDocumentsPage = ({ selectedAsset }) => {
  const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  const selectedAssetID = selectedAsset.asset_id;

  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [incomingDocuments, setIncomingDocuments] = useState<
    IncomingDocument[]
  >([]); //This is because the fetched documents are a mixture from documents and document_types tables
  const [documentId, setDocumentId] = useState(null);

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
      <div className="bg-gray-200 h-full overflow-y-auto p-5 pb-20">
        <div className="flex flex-grow items-center">
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
        <div>
          {incomingDocuments.map((document) => (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDocumentId(document.document_id);
              }}
            >
              <DocumentsCard
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
              />
            </div>
          ))}
        </div>
        <div className={`${addDocumentsOpen ? "" : "hidden"}`}>
          <AddDocumentsForm
            addDocumentsOpen={addDocumentsOpen}
            setAddDocumentsOpen={setAddDocumentsOpen}
            assetID={selectedAssetID}
          // locationID={selectedLocation}
          />
        </div>
      </div>
    </>
  );
};

export default AssetDocumentsPage;
