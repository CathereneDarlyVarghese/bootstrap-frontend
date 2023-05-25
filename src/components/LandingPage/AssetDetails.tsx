import PendingOrders from "./PendingOrders";
import WorkOrderForm from "./WorkOrderForm1";
import closeIcon from "../../icons/closeIcon.svg";
import deleteIcon from "../../icons/deleteIcon.svg";

const AssetDetails = ({
  assetId,
  cardImage,
  cardTitle,
  assetType,
  DescriptionText,
  pendingOrderDetails,
}) => {
  return (
    <>
      <div className="h-5/6 mx-4 mt-2 p-5 bg-white border-blue-900 rounded-xl">
        <div className="flex flex-row">
          <h1 className="font-sans font-bold text-xl capitalize">
            {cardTitle}
          </h1>
          <button className="ml-3">
            <img src={deleteIcon} />
          </button>
          <button className="ml-auto">
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
          <WorkOrderForm assetId={assetId} />
          <h1 className="font-semibold text-blue-900 mr-2">Add Work Order</h1>
        </div>
      </div>
    </>
  );
};

export default AssetDetails;
