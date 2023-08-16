import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import DocumentsCard from "./DocumentsCard";
import AddDocumentsForm from "./AddDocumentsForm";
import { getDocumentsByAssetId } from "services/documentServices";
import { IncomingDocument } from "types";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useQuery } from "@tanstack/react-query";

const AssetDocumentsPage = ({ selectedAsset }) => {
  // const searchParams = new URLSearchParams(location.search);
  const selectedAssetID = selectedAsset.asset_id;
  const assetName = selectedAsset.asset_name;
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [addDocumentsOpen, setAddDocumentsOpen] = useState(false);
  const [incomingDocuments, setIncomingDocuments] = useState<
    IncomingDocument[]
  >([]); //This is because the fetched documents are a mixture from documents and document_types tables
  const [documentID, setDocumentID] = useState(null);
  const [getResult, setGetResult] = useState<string | null>(null);
  const formatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };
  const [fileOpen, setFileOpen] = useState(false);

  const fetchDocumentsById = async () => {
    try {
      const documents = await getDocumentsByAssetId(
        authTokenObj.authToken,
        selectedAssetID
      );
      setIncomingDocuments(documents);
    } catch (error) {
      setGetResult(formatResponse(error.response?.data || error));
    }
  };

  const { data: DocumentsById } = useQuery({
    queryKey: ["query-documentsByAssetId"],
    queryFn: fetchDocumentsById,
  });

  useEffect(() => {
    fetchDocumentsById();
  }, [selectedAssetID]);

  return (
    <>
      <div
        className={`h-full overflow-y-auto p-2 pb-20 ${
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
          <h1 className="text-blue-800 dark:text-blue-700 text-lg md:text-sm font-sans font-semibold">
            Documents - {assetName}
          </h1>
          <button
            className="btn bg-blue-900 hover:bg-blue-900 ml-auto"
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
                className="border border-gray-300 dark:border-gray-600 rounded-xl my-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setDocumentID(document.document_id);
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
      </div>
    </>
  );
};

export default AssetDocumentsPage;
