import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiFillExclamationCircle } from "react-icons/ai";
import { BsFillXCircleFill } from "react-icons/bs";
import documentIcon from "../../icons/documentIcon.svg";

const DocumentsCard = ({
  documentName,
  documentDescription,
  documentType,
  startDate,
  endDate,
  documentNotes,
  fileStatus,
  documentStatus,
  fileName,
}) => {
  return (
    <div className="card bg-white dark:bg-gray-800 p-5" style={{ height: "fit-content" }}>
      <div className="flex flex-row-reverse md:flex-col">
        <div className="ml-auto mb-3 flex flex-row md:ml-0 gap-4 items-center">
          <div className="mr-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
            <div>
              <h1 className="text-black dark:text-white font-semibold font-sans text-md md:text-sm md:font-medium">
                Start Date:
              </h1>
            </div>
            <div className="flex flex-row items-center gap-1 border rounded-md p-2 text-md md:text-sm">
              <AiOutlineCalendar className="text-xl text-blue-900" />
              <h1 className="text-blue-900 font-sans font-semibold text-md md:text-xs md:font-medium">
                {startDate}
              </h1>
            </div>
          </div>
          <div className="ml-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
            <div>
              <h1 className="text-black dark:text-white font-semibold font-sans text-md md:text-sm md:font-medium">
                End Date:
              </h1>
            </div>
            <div className="flex flex-row items-center gap-1 border rounded-md p-2 text-md md:text-sm">
              <AiOutlineCalendar className="text-xl text-blue-900" />
              <h1 className="text-blue-900 font-sans font-semibold text-md md:text-xs md:font-medium">
                {endDate}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          <h1 className="text-black dark:text-white text-lg font-semibold font-sans">
            {documentName}
          </h1>
          <div className="badge bg-blue-200 border-none font-semibold text-blue-900 p-3">
            {documentType}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-gray-400">{documentDescription}</p>
      </div>
      <div className="mt-2">
        <h1 className="text-black dark:text-white font-sans font-semibold">Note:</h1>
        <p className="text-gray-400">{documentNotes}</p>
      </div>
      <div className="mt-4 flex flex-row gap-5 items-center">
        <div className="flex flex-row gap-2 items-center">
          <img src={documentIcon} />
          <h1 className="font-sans text-gray-500 text-md md:text-xs">
            {fileName || ""}
          </h1>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {fileStatus === "File Uploaded" ? (
            <>
              <BsFillCheckCircleFill className="text-lg text-green-500" />
              <h1 className="font-sans text-green-500 text-md md:text-xs">
                {fileStatus}
              </h1>
            </>
          ) : (
            <>
              <BsFillXCircleFill className="text-lg text-red-500" />
              <h1 className="font-sans text-red-500 text-md md:text-xs">
                {fileStatus}
              </h1>
            </>
          )}
        </div>
        <div className="ml-auto">
          {documentStatus === "active" ? (
            <BsFillCheckCircleFill className="text-green-600 text-3xl md:text-2xl" />
          ) : documentStatus === "expiring soon" ? (
            <AiFillExclamationCircle className="text-yellow-600 text-3xl md:text-2xl" />
          ) : (
            <BsFillXCircleFill className="text-red-600 text-3xl md:text-2xl" />
          )}
          {/* <AiFillExclamationCircle className="text-yellow-600 text-3xl md:text-2xl" /> */}
        </div>
      </div>
    </div>
  );
};

export default DocumentsCard;
