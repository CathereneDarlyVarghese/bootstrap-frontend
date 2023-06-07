import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiFillExclamationCircle } from "react-icons/ai";
import documentIcon from "../../icons/documentIcon.svg";

const DocumentsCard = () => {
  return (
    <div className="card bg-white p-5 my-5" style={{ height: "fit-content" }}>
      <div className="flex flex-row-reverse md:flex-col">
        <div className="ml-auto mb-3 flex flex-row md:ml-0 gap-4 items-center">
          <div className="mr-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
            <div>
              <h1 className="text-black font-semibold font-sans text-md md:text-sm md:font-medium">
                Start Date:
              </h1>
            </div>
            <div className="flex flex-row items-center gap-1 border rounded-md p-2 text-md md:text-sm">
              <AiOutlineCalendar className="text-xl text-blue-900" />
              <h1 className="text-blue-900 font-sans font-semibold text-md md:text-xs md:font-medium">
                11 Jan 2023
              </h1>
            </div>
          </div>
          <div className="ml-auto flex md:flex-col flex-row items-center md:items-start gap-2 md:gap-0">
            <div>
              <h1 className="text-black font-semibold font-sans text-md md:text-sm md:font-medium">
                End Date:
              </h1>
            </div>
            <div className="flex flex-row items-center gap-1 border rounded-md p-2 text-md md:text-sm">
              <AiOutlineCalendar className="text-xl text-blue-900" />
              <h1 className="text-blue-900 font-sans font-semibold text-md md:text-xs md:font-medium">
                11 Jan 2023
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          <h1 className="text-black text-lg font-semibold font-sans">
            Test Application
          </h1>
          <div className="badge bg-blue-200 border-none font-semibold text-blue-900 p-3">
            Invoice
          </div>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          non risus at elit suscipit egestas eget a elit. Duis aliquet fermentum
          scelerisque. Curabitur efficitur scelerisque metus, egestas feugiat
          erat scelerisque eu. Proin ac sodales mi, quis aliquet neque. Nam nec
          ante aliquam, ullamcorper ex ac, semper dolor. Aenean sce
        </p>
      </div>
      <div className="mt-2">
        <h1 className="text-black font-sans font-semibold">Note:</h1>
        <p className="text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          non risus at elit suscipit egestas eget a elit. Duis aliquet fermentum
          scelerisque. egestas feugiat erat scelerisque eu. Proin ac sodales mi,
          quis aliquet neque. Nam nec ante aliqu
        </p>
      </div>
      <div className="mt-4 flex flex-row gap-5 items-center">
        <div className="flex flex-row gap-2 items-center">
          <img src={documentIcon} />
          <h1 className="font-sans text-gray-500 text-md md:text-xs">
            Documents Name
          </h1>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <BsFillCheckCircleFill className="text-lg text-green-500" />
          <h1 className="font-sans text-green-500 text-md md:text-xs">
            File Uploaded
          </h1>
        </div>
        <div className="ml-auto">
          <AiFillExclamationCircle className="text-yellow-600 text-3xl md:text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default DocumentsCard;
