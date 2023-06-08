import WorkOrderForm from "./WorkOrderForm1";
import closeIcon from "../../icons/closeIcon.svg";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { deleteInventory } from "services/apiServices";
import { toast } from "react-toastify";

interface AssetDetailsProps {
  sessionToken: string | null;
  assetId: string | null;
  cardTitle: string | null;
  cardImage: string | null;
  sectionName: string | null;
  placementName: string | null;
  purchasePrice: string | null;
  currentValue: string | null;
  notes: string | null;
  assetType: string | null;
  setAssetId: (id: string | null) => void;
  closeAsset: () => void;
}

const AssetDetails: React.FC<
  AssetDetailsProps & { refreshAssets: () => void }
> = ({
  assetId,
  cardImage,
  cardTitle,
  assetType,
  sessionToken,
  refreshAssets,
  setAssetId,
  closeAsset,
  sectionName,
  placementName,
  purchasePrice,
  currentValue,
  notes,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="h-5/6 mx-4 mt-2 p-5 bg-white border-blue-900 rounded-xl overflow-y-auto"
      id="style-7"
    >
      <div className="flex 2xl:flex-row lg:flex-col gap-5 mb-3">
        <div className="flex flex-col">
          <button
            className="ml-auto 2xl:hidden lg:block"
            onClick={() => setAssetId(null)}
          >
            <img src={closeIcon} onClick={closeAsset} />
          </button>
          <h1 className="font-sans font-bold text-xl lg:text-lg capitalize my-auto mx-auto">
            {cardTitle}
          </h1>
        </div>

        <div className="flex flex-row justify-center items-center mx-auto">
          <button className="mx-3">
            <FiEdit3 className="text-xl" />
          </button>
          <button
            className="mx-3"
            onClick={async () => {
              if (
                window.confirm("Are you sure you want to delete this asset?")
              ) {
                console.log("Asset ID ==>> ", assetId);
                await deleteInventory(sessionToken, assetId)
                  .then(() => {
                    toast("Deleted successfully", {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    refreshAssets();
                  })
                  .catch((error) => {
                    console.error("Error deleting inventory:", error);
                    toast("Oops, Something went wrong", {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                  });
              }
            }}
          >
            <AiOutlineDelete className="text-2xl mx-3" />
          </button>
          <button className="mx-3">
            <BsQrCode className="text-xl" />
          </button>

          <WorkOrderForm
            assetId1={assetId}
            closeModal={() => {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
        <button
          className="ml-auto 2xl:block lg:hidden"
          onClick={() => setAssetId(null)}
        >
          <img src={closeIcon} onClick={closeAsset} />
        </button>
      </div>
      <figure className="rounded-none">
        <img
          src={cardImage}
          alt="an image"
          className="rounded-xl h-48 w-fit object-cover mx-auto"
        />
      </figure>
      <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
        <div className="flex 2xl:flex-row lg:flex-col">
          <h2
            className="flex text-blue-900 text-xl font-semibold font-sans tracking-wide xl:text-sm"
            style={{ wordSpacing: 3 }}
          >
            More Information:
          </h2>

          <div className="my-2 2xl:ml-auto lg:ml-0 lg:mx-auto flex flex-row items-center">
            <button className="badge w-fit bg-gray-200 text-blue-700 font-semibold font-sans cursor-default capitalize border-white border-none mx-1 p-4 text-md xl:text-xs sm:text-[10px]">
              {assetType}
            </button>
            <button className="badge bg-green-400 text-white font-semibold font-sans cursor-default capitalize border-white border-none ml-auto mx-1 p-4 text-md xl:text-xs sm:text-[10px]">
              Active
            </button>
            <button className="badge bg-green-400 text-white font-semibold font-sans cursor-default capitalize border-white border-none ml-auto mx-1 p-4 text-md xl:text-xs sm:text-[10px]">
              <AiOutlineCalendar className="mr-3 text-xl" />
              10/07/23
            </button>
          </div>
        </div>
        <div>
          <p className="text-black font-sans my-1 text-sm">
            Section: {sectionName}
          </p>
          <p className="text-black font-sans my-1 text-sm">
            Placement: {placementName}
          </p>
          <p className="text-black font-sans my-1 text-sm">
            Purchase Price: {purchasePrice}
          </p>
          <p className="text-black font-sans my-1 text-sm">
            Current Value: {currentValue}
          </p>
          <p className="text-black font-sans my-1 text-sm">Notes: {notes}</p>
        </div>
      </div>
      <div className="flex flex-row md:flex-col items-center gap-5 p-2 justify-around">
        <button
          className="btn btn-sm bg-blue-900 hover:bg-blue-900 text-white font-sans capitalize md:w-40"
          onClick={() => navigate("/documents")}
        >
          Documents
        </button>
        <button
          className="btn btn-sm bg-blue-900 hover:bg-blue-900 text-white font-sans capitalize md:w-40"
          onClick={() => navigate("/work-orders")}
        >
          Maintenance
        </button>
        <button
          className="btn btn-sm bg-blue-900 hover:bg-blue-900 text-white font-sans capitalize md:w-40"
          onClick={() => navigate("/status-checks")}
        >
          Status Checks
        </button>
      </div>
    </div>
  );
};

export default AssetDetails;
