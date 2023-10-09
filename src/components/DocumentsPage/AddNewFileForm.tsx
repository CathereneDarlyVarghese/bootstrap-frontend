import React, { useState } from "react";
import { appendToFileArray } from "services/fileServices";
import { uploadFiletoS3 } from "utils";
import { toast } from "react-toastify";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useQueryClient } from "@tanstack/react-query";

const AddNewFileForm = ({ fileID, open, closeForm }) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files[0];
    setFile(newFile);
  };

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    // Step 1: Upload the file to S3 bucket
    const documentLocation = await uploadFiletoS3(file, "document");

    const newFileArrayEntry: string = documentLocation.location;

    const newModifiedByArrayEntry = authTokenObj.attributes.given_name;
    const newModifiedDateArrayEntry = new Date().toISOString().substring(0, 10);

    try {
      await appendToFileArray(
        authTokenObj.authToken,
        fileID,
        newFileArrayEntry,
        newModifiedByArrayEntry,
        newModifiedDateArrayEntry,
      );
      queryClient.invalidateQueries(["query-documentsByLocationId"]);
      queryClient.invalidateQueries(["query-documentsByAssetId"]);
      toast.success("File Added Successfully");
    } catch (error) {
      toast.error("Failed to add file");
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
        <div className="modal-box dark:bg-gray-900">
          <div className="flex flex-row">
            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-700">
              Add a New File
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

              {/* upload file button as design */}
              {/* <input
                type="file"
                required
                id="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-md text-white border border-gray-300
                rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none
                dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white
                file:font-sans my-3 hidden"
              />
              <div className="flex flex-row rounded-lg border border-gray-300
              dark:border-gray-500 p-2 my-2">
                <input
                  type="text"
                  value={`${file ? file.name : "No file chosen"}`}
                  className={`bg-transparent text-sm font-sans w-4/5 md:w-1/2 ${
                    file && file
                      ? "text-black dark:text-white"
                      : "text-gray-400"
                  }`}
                />
                <button
                  className="btn btn-xs bg-transparent border border-gray-400
                  hover:border-gray-400 hover:bg-transparent normal-case font-normal
                  w-fit border text-blue-600 dark:text-white font-sans text-xs
                  md:text-[9px] p-0.5  rounded-xl ml-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    const uploadButton = document.querySelector(
                      "#file"
                    ) as HTMLElement;
                    uploadButton.click();
                  }}
                >
                  <AiOutlinePaperClip className="text-lg" />
                  Choose File
                </button>
              </div> */}

              <div className="w-full flex flex-row justify-center">
                <button
                  id="submit"
                  type="submit"
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

export default AddNewFileForm;
