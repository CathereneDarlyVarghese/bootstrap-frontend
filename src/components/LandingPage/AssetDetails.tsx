import PendingOrders from "./PendingOrders";
import WorkOrderForm from "./WorkOrderForm1";
import closeIcon from "../../icons/closeIcon.svg";
import deleteIcon from "../../icons/deleteIcon.svg";

import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { deleteInventory } from "services/apiServices";
import { toast } from "react-toastify";
import { AssetTypes } from "enums";
import { WorkOrder } from "types";

interface AssetDetailsProps {
  sessionToken: string | null;
  assetId: string | null;
  cardTitle: string | null;
  cardImage: string | null;
  assetType: AssetTypes;
  DescriptionText: string | null;
  pendingOrderDetails: WorkOrder[];
  setAssetId: (id: string | null) => void;
}

const AssetDetails: React.FC<
  AssetDetailsProps & { refreshAssets: () => void }
> = ({
  assetId,
  cardImage,
  cardTitle,
  assetType,
  DescriptionText,
  pendingOrderDetails,
  sessionToken,
  refreshAssets,
  setAssetId,
}) => {
  return (
    <>
      {console.log("SessionsToken FRom AssetDetails ==>> ", sessionToken)}
      <div className="h-5/6 mx-4 mt-2 p-5 bg-white border-blue-900 rounded-xl">
        <div className="flex flex-row">
          <h1 className="font-sans font-bold text-xl capitalize">
            {cardTitle}
          </h1>

          <button
            className="ml-auto"
            onClick={() => {
              setAssetId(null);
            }}
          >
            <img src={closeIcon} />
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
          <div className="flex flex-row">
            <h2
              className="flex text-blue-900 text-xl font-semibold font-sans tracking-wide xl:text-sm w-2/3"
              style={{ wordSpacing: 3 }}
            >
              More Information:
            </h2>

            {/* QR Code Button
            <button className="btn btn-xs bg-blue-900 border-none hover:bg-gradient-to-r from-blue-600 to-blue-400  ml-auto">
              Download QR
            </button> */}

            <button className="badge w-fit bg-gray-200 text-blue-700 font-semibold font-sans capitalize border-white border-none ml-auto p-4 text-md xl:text-xs">
              {assetType}
            </button>
          </div>
          <div>
            <p>{DescriptionText}</p>
          </div>

          {/* Pending Orders List */}

          {/* <h3 className="text-xl text-balck font-bold mt-5">Work Orders</h3>
          <div className="card border overflow-auto h-fit px-5" id="style-7">
            {pendingOrderDetails.map((wo) => (
              <PendingOrders
                assetName={wo.name}
                status={wo.status}
                description={wo.description}
                pendingImage={wo.image}
                orderType={wo.type}
              />
            ))}
            {console.log("pendingOrderDetails")}
            {console.log(pendingOrderDetails)}
          </div> */}
        </div>
        <div className="absolute bottom-14 right-6 flex flex-row items-center p-2">
          <Link to={`/work-orders?assetId=${encodeURIComponent(assetId)}`}>
            <p className="font-sans text-blue-700">Go to Workorders</p>
          </Link>
          <WorkOrderForm
            assetId1={assetId}
            closeModal={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          <button
            className="mr-5"
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
            <AiOutlineDelete
              className="text-slate-800"
              style={{ fontSize: 45 }}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default AssetDetails;
