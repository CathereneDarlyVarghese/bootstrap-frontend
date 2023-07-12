import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { locationAtom, useSyncedAtom } from "store/locationStore";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";
import { getDocumentsByLocationIdOnly } from "services/documentServices";
import { Document, IncomingDocument } from "types";
import { getFileById } from "services/fileServices";

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
  const [fileOpen, setFileOpen] = useState(false);
  const [fileName, setFileName] = useState<string>(null);

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

        //Initialising selectedDocument as the first one (to avoid null error)
        setSelectedDocument(documentsData[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocuments();
  }, [location]);

  useEffect(() => {
    const fetchFile = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const fetchedFile = await getFileById(
        userData.signInUserSession.accessToken.jwtToken,
        selectedDocument.file_id
      );

      setFileName(fetchedFile.file_array[0]);
    };
    fetchFile();
  }, [selectedDocument]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className={`h-full overflow-y-auto p-5 pb-20 ${addDocumentsOpen && !fileOpen
          ? "2xl:bg-gray-200 dark:2xl:bg-black xl:bg-white dark:xl:bg-gray-800"
          : "bg-gray-200 dark:bg-black"
          }`}
      >
        <div
          className={`flex flex-grow items-center ${addDocumentsOpen && !fileOpen ? "xl:hidden" : ""
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
          className={`flex ${addDocumentsOpen || fileOpen ? "flex-row" : "flex-col"
            } items-start gap-2 mt-5`}
        >
          <div
            // className={`${addDocumentsOpen ? "w-3/5 xl:hidden" : "w-full"}`}
            className={`${addDocumentsOpen
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
                  // FIX THIS - For now we are only displaying one file name
                  fileID={document.file_id}
                  assetID={document.asset_id}
                  locationID={document.location_id}
                />
              </div>
            ))}
          </div>
          <div
            className={`${addDocumentsOpen && !fileOpen ? "w-2/5 xl:w-full" : "hidden"
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
