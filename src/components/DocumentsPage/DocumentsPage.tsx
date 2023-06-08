import React, { useState } from "react";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";

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
        <div className="mb-20">
          <DocumentsCard />
          <DocumentsCard />
          <DocumentsCard />
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
