import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { locationAtom, useSyncedAtom } from "store/locationStore";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";
import { getDocumentsByLocationIdOnly } from "services/documentServices";
import { Document, IncomingDocument } from "types";

const testDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat quam et fringilla dictum. Nunc facilisis vitae augue a";

const testNotes =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat quam et fringilla dictum. Nunc facilisis vitae augue a fermentum. Quisque vel feugiat diam. Cras commodo elementum euismod. Suspendisse eleifend nulla elementum nulla cursus malesuada. Cras dapibus ipsum vitae venenatis scelerisque. Pellentesque dictum ";

const DocumentsPage = () => {
  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);
  const [location, setLocation] = useSyncedAtom(locationAtom);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [incomingDocuments, setIncomingDocuments] = useState<
    IncomingDocument[]
  >([]); //This is because the fetched documents are a mixture from documents and document_types tables
  const [documentId, setDocumentId] = useState(null);
  // const [selectedDocument, setSelectedDocument] = useState(null);

  const selectedLocation = location.locationId;
  console.log("The selected location (1) ==>>", selectedLocation);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.accessToken.jwtToken);
        const documentsData = await getDocumentsByLocationIdOnly(
          userData.signInUserSession.accessToken.jwtToken,
          location.locationId
        );
        setIncomingDocuments(documentsData);
        console.log("The selected location (2) ==>>", selectedLocation);
        console.log("The fetched documents ==>>", documentsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocuments();
  }, [location]);

  return (
    <>
      <div className={`h-full overflow-y-auto p-5 pb-20 ${addDocumentsOpen ? "2xl:bg-gray-200 xl:bg-white" : "bg-gray-200"}`}>
        <div className={`flex flex-grow items-center ${addDocumentsOpen ? "xl:hidden" : ""}`}>
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
        <div className={`flex ${addDocumentsOpen ? "flex-row" : "flex-col"} items-start gap-2 mt-5`}>
          <div className={`${addDocumentsOpen ? "w-3/5 xl:hidden" : "w-full"}`}>
            {incomingDocuments.map((document) => (
              <div className="cursor-pointer mb-5"
                onClick={() => {
                  // setSelectedDocument(document);
                  setDocumentId(document.document_id);
                  // removeClass("#parent-element .asset-details-card", "lg:hidden");
                  // addClass("#parent-element .documents-card", "lg:w-full");
                  // addClass("#parent-element .asset-card", "lg:hidden");
                  console.log("File array ==>> ", document.file_array[0]);
                }}
              >
                <DocumentsCard
                  documentName={document.document_name}
                  documentDescription={document.document_description}
                  documentType={document.document_type}
                  startDate={document.start_date}
                  endDate={document.end_date}
                  documentNotes={document.document_notes}
                  fileStatus="File Uploaded"
                  documentStatus="active"
                  // FIX THIS - For now we are only displaying one file name
                  fileName={document.file_array}
                />
              </div>
            ))}
          </div>
          <div className={`${addDocumentsOpen ? "w-2/5 xl:w-full" : "hidden"}`}>
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
