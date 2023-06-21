import React from "react";
import closeIcon from "../../icons/closeIcon.svg";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import { Link } from "react-router-dom";
import { deleteInventory } from "services/apiServices";
import { toast } from "react-toastify";
import { AiOutlineCalendar } from "react-icons/ai";
import { TfiClose } from "react-icons/tfi";

interface StatusDetailsProps {
  sessionToken: string | null;
  uptimeCheckId: string;
  assetId: string;
  statusCheck: string;
  imageArray: string[][];
  modifiedBy: string;
  modifiedDate: string;
  uptimeNotes: string;
  refreshAssets: () => void;
  closeAsset: () => void;
}

const StatusDetails: React.FC<StatusDetailsProps> = ({
  sessionToken,
  uptimeCheckId,
  assetId,
  statusCheck,
  imageArray,
  modifiedBy,
  modifiedDate,
  uptimeNotes,
  refreshAssets,
  closeAsset,
}) => {
  console.log(
    "imageArray[0]:",
    imageArray && imageArray.length > 0 ? imageArray[0] : null
  );

  console.log("StatusCheck:", statusCheck);

  const handleDelete = async () => {
    try {
      await deleteInventory(sessionToken || "", assetId);
      refreshAssets();
      toast.success("Asset deleted successfully");
    } catch (error) {
      console.log("Error deleting asset:", error);
      toast.error("Failed to delete asset");
    }
  };

  return (
    <div className="h-5/6 mx-4 mt-2 p-5 bg-white dark:bg-gray-800 rounded-xl overflow-y-auto flex flex-col border border-gray-200 dark:border-gray-600 hover:border-blue-800 hover:dark:border-gray-400">
      <div className="flex 2xl:flex-row lg:flex-col gap-5 mb-3">
        <div className="flex flex-col">
          <button className="ml-auto 2xl:hidden lg:block" onClick={closeAsset}>
            <img src={closeIcon} alt="Close" />
          </button>
          <h1 className="font-sans font-bold text-xl text-black dark:text-white lg:text-lg capitalize my-auto mx-auto">
            Status Check Date: {modifiedDate}
          </h1>
        </div>
        <button className="ml-auto 2xl:block lg:hidden" onClick={closeAsset}>
          <TfiClose className="text-black dark:text-white" />
        </button>
      </div>
      <figure className="rounded-none">
        {imageArray && imageArray[0] && (
          <img
            src={imageArray[0][0]}
            alt="an image"
            className="rounded-xl h-32 w-fit object-cover mx-auto"
          />
        )}
      </figure>
      <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
        <div className="flex 2xl:flex-row lg:flex-col">
          <h2
            className="flex text-black text-xl font-semibold font-sans tracking-wide xl:text-sm"
            style={{ wordSpacing: 3 }}
          >
            {statusCheck}
          </h2>
          <div className="my-2 2xl:ml-auto lg:ml-0 lg:mx-auto flex flex-row items-center">
            <Link to={`/qr-code/${assetId}`}>
              <BsQrCode className="text-blue-500 text-xl" />
            </Link>
            <Link to={`/work-orders/${assetId}`}>
              <AiOutlineCalendar className="text-blue-500 text-xl mx-2" />
            </Link>
            <Link to={`/edit-asset/${assetId}`}>
              <FiEdit3 className="text-blue-500 text-xl" />
            </Link>
            <AiOutlineDelete
              className="text-red-500 text-xl ml-2 cursor-pointer"
              onClick={handleDelete}
            />
          </div>
        </div>
        <div>
          <p className="text-blue-900 dark:text-blue-500 font-semibold font-sans my-1 text-sm">
            Modified By: {modifiedBy}
          </p>
          <p className="text-blue-900 dark:text-blue-500 font-semibold font-sans my-1 text-sm">
            Modified Date: {modifiedDate}
          </p>
          <p className="text-blue-900 dark:text-blue-500 font-semibold font-sans my-1 text-sm">
            Notes: {uptimeNotes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusDetails;
