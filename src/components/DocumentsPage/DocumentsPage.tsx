import React, { useState } from 'react';
import { locationAtom, useSyncedAtom } from 'store/locationStore';
import { getDocumentsByLocationIdOnly } from 'services/documentServices';
import { IncomingDocument } from 'types';
import { getFileById } from 'services/fileServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { useQuery } from '@tanstack/react-query';
import AddDocumentsForm from './AddDocumentsForm';
import DocumentsCard from './DocumentsCard';

const DocumentsPage = () => {
  // --- STATE VARIABLES ---
  // State for document modal
  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);

  // State for incoming documents
  const [incomingDocuments, setIncomingDocuments] = useState<
    IncomingDocument[]
  >([]);

  // State for error/result messages
  const [, setGetResult] = useState<string | null>(null);

  // Default document state
  const defaultDocument = {
    document_id: '',
    document_name: '',
    document_description: '',
    document_type_id: '',
    start_date: '',
    end_date: '',
    file_id: '',
    document_notes: '',
    modified_by: '',
    modified_date: '',
    org_id: '',
    asset_id: '',
    location_id: '',
    document_type: '',
  };
  const [selectedDocument, setSelectedDocument] =
    useState<IncomingDocument>(defaultDocument);

  // State for file display
  const [fileOpen] = useState(false);
  const [, setFileName] = useState<string>(null);

  // Location and authentication states
  const [location] = useSyncedAtom(locationAtom);
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');

  // --- HOOKS ---

  // Query for fetching documents by location
  useQuery({
    queryKey: ['query-documentsByLocationId', location],
    queryFn: async () => {
      const documents = await getDocumentsByLocationIdOnly(
        authTokenObj.authToken,
        location.locationId,
      );
      setIncomingDocuments(documents);
    },
    enabled: !!authTokenObj.authToken,
  });

  // Query for fetching file by document
  useQuery({
    queryKey: ['query-files', selectedDocument],
    queryFn: async () => {
      const fileData = await getFileById(
        authTokenObj.authToken,
        selectedDocument.file_id,
      );
      const fileName =
        fileData.file_array && fileData.file_array[0]
          ? fileData.file_array[0]
          : '';
      setFileName(fileName);
    },
    enabled: !!authTokenObj.authToken,
  });

  // Derived states or computations
  const selectedLocation = location.locationId;

  return (
    <>
      <div
        className={`h-full overflow-y-auto p-5 pb-20 ${
          addDocumentsOpen && !fileOpen
            ? '2xl:bg-gray-200 dark:2xl:bg-black xl:bg-white dark:xl:bg-gray-800'
            : 'bg-gray-200 dark:bg-black'
        }`}
      >
        <div
          className={`flex flex-grow items-center ${
            addDocumentsOpen && !fileOpen ? 'xl:hidden' : ''
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
            addDocumentsOpen || fileOpen ? 'flex-row' : 'flex-col'
          } items-start gap-2 mt-5`}
        >
          <div
            // className={`${addDocumentsOpen ? "w-3/5 xl:hidden" : "w-full"}`}
            className={`${
              addDocumentsOpen
                ? 'w-3/5 xl:hidden'
                : fileOpen
                ? 'w-2/5 xl:hidden'
                : !fileOpen
                ? 'w-full'
                : 'w-full'
            }`}
          >
            {incomingDocuments.map(document => (
              <div
                className="mb-5"
                onClick={() => {
                  setSelectedDocument(document);
                }}
              >
                <DocumentsCard
                  document={document}
                  fileStatus="File Uploaded"
                  documentStatus="active"
                />
              </div>
            ))}
          </div>
          <div
            className={`${
              addDocumentsOpen && !fileOpen ? 'w-2/5 xl:w-full' : 'hidden'
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
