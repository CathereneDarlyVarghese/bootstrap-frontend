import React from "react";
import DocumentsCard from "./DocumentsCard";

const DocumentsPage = () => {
  return (
    <div className="bg-gray-200 h-full overflow-y-auto p-5 pb-20">
      <div className="flex flex-grow items-center">
        <h1 className="text-blue-800 text-xl font-sans font-semibold">
          Documents
        </h1>
        <button className="btn btn-sm bg-blue-900 hover:bg-blue-900 capitalize w-32 ml-auto">
          +Add
        </button>
      </div>
      <div>
        <DocumentsCard />
        <DocumentsCard />
        <DocumentsCard />
      </div>
    </div>
  );
};

export default DocumentsPage;
