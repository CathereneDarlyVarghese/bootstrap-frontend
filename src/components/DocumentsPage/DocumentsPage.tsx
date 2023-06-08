import React, { useState } from "react";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";

const testDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat quam et fringilla dictum. Nunc facilisis vitae augue a";

const testNotes =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat quam et fringilla dictum. Nunc facilisis vitae augue a fermentum. Quisque vel feugiat diam. Cras commodo elementum euismod. Suspendisse eleifend nulla elementum nulla cursus malesuada. Cras dapibus ipsum vitae venenatis scelerisque. Pellentesque dictum ";

const DocumentsPage = () => {
  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);
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
          <DocumentsCard
            documentName="Test Application"
            documentDescription={testDescription}
            documentType="Invoice"
            startDate="10 Jan 2023"
            endDate="12 Feb 2025"
            documentNotes={testNotes}
            fileStatus="file missing"
            documentStatus="expired"
            fileName="sample file"
          />
          <DocumentsCard
            documentName="Test Application 2"
            documentDescription={testDescription}
            documentType="Contract"
            startDate="10 Jan 2021"
            endDate="12 Feb 2023"
            documentNotes={testNotes}
            fileStatus="File Uploaded"
            documentStatus="active"
            fileName="sample file"
          />
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
