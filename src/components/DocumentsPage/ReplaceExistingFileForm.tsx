import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { replaceLatestInFileArray } from "services/fileServices";
import { uploadFiletoS3 } from "utils";
import { toast } from "react-toastify";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useQueryClient } from "@tanstack/react-query";

const ReplaceExistingFileForm = ({ fileID, open, closeForm }) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<any>();
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    // Step 1: Upload the file to S3 bucket
    const documentLocation = await uploadFiletoS3(file, "document");

    const newFileArrayEntry: string = documentLocation.location;

    const newModifiedByArrayEntry = authTokenObj.attributes.given_name;
    const newModifiedDateArrayEntry = new Date().toISOString().substring(0, 10);

    try {
      const replacedFile = await replaceLatestInFileArray(
        authTokenObj.authToken,
        fileID,
        newFileArrayEntry,
        newModifiedByArrayEntry,
        newModifiedDateArrayEntry
      );
      console.log("New File ==>> ", replacedFile);
      queryClient.invalidateQueries(["query-documentsByLocationId"]);
      queryClient.invalidateQueries(["query-documentsByAssetId"]);
      queryClient.invalidateQueries(["fetch-document-details"]);
      toast.success("Existing File Replaced Successfully");
    } catch (error) {
      console.error("Failed to Replace Existing File:", error);
      toast.error("Failed to replace existing file");
    }
  };

  return (
    <>
      <input
        type="checkbox"
        checked={open}
        id="my_modal_6"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box bg-white dark:bg-gray-900">
          <div className="flex flex-row">
            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-700">
              Replace Existing File
            </h3>
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              strokeWidth="1.5"
              className="w-6 h-6 text-blue-800 dark:text-white ml-auto cursor-pointer"
              onClick={closeForm}
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="my-5">
            <form method="post" onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="file_input"
                  className="font-sans font-semibold text-sm text-black dark:text-white"
                >
                  Upload File
                </label>

                <input
                  type="file"
                  required
                  id="file"
                  name="file"
                  onChange={(e) => handleFileChange(e)}
                  className="text-black dark:text-white"
                />
              </div>

              <div className="w-full flex flex-row justify-center">
                <button
                  className="btn btn-sm bg-blue-900 hover:bg-blue-900"
                  onClick={closeForm}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReplaceExistingFileForm;
