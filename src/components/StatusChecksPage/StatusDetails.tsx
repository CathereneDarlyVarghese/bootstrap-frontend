import WorkOrderForm from "../LandingPage/WorkOrderForm1";
import closeIcon from "../../icons/closeIcon.svg";
import { useNavigate, useLocation } from "react-router-dom";

import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import { Link } from "react-router-dom";
import { deleteInventory } from "services/apiServices";
import { toast } from "react-toastify";
import { AssetTypes } from "enums";
import { WorkOrder } from "types";

import { AiOutlineCalendar } from "react-icons/ai";

interface StatusDetails {
  sessionToken: string | null;
  assetId: string | null;
  cardTitle: string | null;
  cardImage: string | null;
  // assetType: AssetTypes;
  assetType: string | null;
  DescriptionText: string | null;
  // pendingOrderDetails: WorkOrder[];
  setAssetId: (id: string | null) => void;
  closeAsset: () => void;
}

const StatusDetails: React.FC<
  StatusDetails & { refreshAssets: () => void }
> = ({
  assetId,
  cardImage,
  cardTitle,
  assetType,
  DescriptionText,
  sessionToken,
  refreshAssets,
  setAssetId,
  closeAsset,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {console.log("SessionsToken FRom AssetDetails ==>> ", sessionToken)}
      <div
        className="h-5/6 mx-4 mt-2 p-5 bg-white border-blue-900 rounded-xl overflow-y-auto flex flex-col"
        id="style-7"
      >
        <div className="flex 2xl:flex-row lg:flex-col gap-5 mb-3">
          <div className="flex flex-col">
            <button
              className="ml-auto 2xl:hidden lg:block"
              onClick={() => {
                setAssetId(null);
              }}
            >
              <img src={closeIcon} onClick={closeAsset} />
            </button>
            <h1 className="font-sans font-bold text-xl lg:text-lg capitalize my-auto mx-auto">
              {cardTitle}
            </h1>
          </div>
          <button
            className="ml-auto 2xl:block lg:hidden"
            onClick={() => {
              setAssetId(null);
            }}
          >
            <img src={closeIcon} onClick={closeAsset} />
          </button>
        </div>
        <figure className="rounded-none">
          <img
            src={cardImage}
            alt="an image"
            className="rounded-xl h-32 w-fit object-cover mx-auto"
          />
        </figure>
        <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
          <div className="flex 2xl:flex-row lg:flex-col">
            <h2
              className="flex text-black text-xl font-semibold font-sans tracking-wide xl:text-sm"
              style={{ wordSpacing: 3 }}
            >
              {cardTitle}
            </h2>

            <div className="my-2 2xl:ml-auto lg:ml-0 lg:mx-auto flex flex-row items-center">
              <button className="badge w-fit bg-gray-200 text-blue-700 font-semibold font-sans capitalize border-white border-none mx-1 p-4 text-md xl:text-xs sm:text-[10px]">
                {assetType}
              </button>
            </div>
          </div>
          <div>
            <p className="text-blue-900 font-semibold font-sans my-1 text-sm">
              Modified By:
            </p>
            <p className="text-blue-900 font-semibold font-sans my-1 text-sm">
              Modified Date:
            </p>
            <p className="text-blue-900 font-semibold font-sans my-1 text-sm">
              Notes:
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusDetails;
