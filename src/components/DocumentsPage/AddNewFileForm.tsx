import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { appendToFileArray } from "services/fileServices";
import { uploadFiletoS3 } from "utils";
import { toast } from "react-toastify";

const AddNewFileForm = ({ fileID, open, closeForm }) => {
  const [file, setFile] = useState<any>();

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

    console.log("Selected File ==>> ", file);

    const userData = await Auth.currentAuthenticatedUser();
    const token = userData.signInUserSession.accessToken.jwtToken;

    // Step 1: Upload the file to S3 bucket
    const documentLocation = await uploadFiletoS3(file, "document");
    console.log("documentLocation ==>> ", documentLocation);

    const newEntry: string = documentLocation.location;
    console.log("newEntry ==>> ", newEntry);

    console.log("File ID ==>> ", fileID);

    try {
      const appendedFile = await appendToFileArray(
        token,
        fileID,
        newEntry
      );
      console.log("Appended File ==>> ", appendedFile);
      toast.success("File Added Successfully", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Failed to Add File:", error);
      toast.error("Failed to add file", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
        <div className="modal-box">
          <div className="flex flex-row">
            <h3 className="font-bold text-lg text-blue-900">Add a New File</h3>
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
              <label
                htmlFor="file_input"
                className="font-sans font-semibold text-sm text-black dark:text-white"
              >
                Upload File
              </label>
              {/* <input
                type="file"
                required
                id="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-md text-white border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3 hidden"
              />
              <div className="flex flex-row rounded-lg border border-gray-300 dark:border-gray-500 p-2 my-2">
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
                  className="btn btn-xs bg-transparent border border-gray-400 hover:border-gray-400 hover:bg-transparent normal-case font-normal w-fit border text-blue-600 dark:text-white font-sans text-xs md:text-[9px] p-0.5  rounded-xl ml-auto"
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
              <input
                type="file"
                required
                id="file"
                name="file"
                onChange={(e) => handleFileChange(e)}
              />
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
