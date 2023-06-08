import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";
import { getAllDocuments } from "services/documentServices";
import { Document, IncomingDocument } from "types";

const testDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat quam et fringilla dictum. Nunc facilisis vitae augue a";

const testNotes =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat quam et fringilla dictum. Nunc facilisis vitae augue a fermentum. Quisque vel feugiat diam. Cras commodo elementum euismod. Suspendisse eleifend nulla elementum nulla cursus malesuada. Cras dapibus ipsum vitae venenatis scelerisque. Pellentesque dictum ";

const DocumentsPage = () => {
  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [incomingDocuments, setIncomingDocuments] = useState<
    IncomingDocument[]
  >([]); //This is because the fetched documents are a mixture from documents and document_types tables
  const [documentId, setDocumentId] = useState(null);
  // const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.accessToken.jwtToken);
        const documentsData = await getAllDocuments(
          userData.signInUserSession.accessToken.jwtToken
        );
        setIncomingDocuments(documentsData);
        console.log("The fetched documents ==>>", documentsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocuments();
  }, []);

  // function to remove class for UI
  const removeClass = (selectClass, removeClass) => {
    document.querySelector(selectClass).classList.remove(removeClass);
  };
  //function to add class for UI
  const addClass = (selectClass, addClass) => {
    document.querySelector(selectClass).classList.add(addClass);
  };

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
                // setSelectedDocument(document);
                setDocumentId(document.document_id);
                // removeClass("#parent-element .asset-details-card", "lg:hidden");
                // addClass("#parent-element .documents-card", "lg:w-full");
                // addClass("#parent-element .asset-card", "lg:hidden");
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
                fileName={document.file_id}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <AddDocumentsForm
          addDocumentsOpen={addDocumentsOpen}
          setAddDocumentsOpen={setAddDocumentsOpen}
        />
      </div>
    </>
  );
};

export default DocumentsPage;
