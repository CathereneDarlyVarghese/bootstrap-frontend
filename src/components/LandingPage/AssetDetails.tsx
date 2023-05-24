import PendingOrders from "./PendingOrders";
import WorkOrderForm from "./WorkOrderForm";

const AssetDetails = ({
  assetId,
  cardImage,
  cardTitle,
  badgeText,
  DescriptionText,
  pendingOrderDetails,
}) => {
  return (
    <>
      <div
        className="w-full h-fit my-5 p-5 bg-slate-100 border-blue-900 rounded-xl"
        // style={{ height: "100%" }}
      >
        <figure className="rounded-none">
          <img
            src={cardImage}
            alt="an image"
            className="rounded-xl h-48 object-cover mx-auto"
          />
        </figure>
        <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
          <div className="flex flex-row">
            <h2 className="card-title w-2/3" style={{ color: "#232F3F" }}>
              {cardTitle}
            </h2>
            <button className="btn btn-xs bg-blue-900 border-none hover:bg-gradient-to-r from-blue-600 to-blue-400  ml-auto">
              Download QR
            </button>
            <div className="badge ml-auto uppercase bg-blue-900 border-none hover:bg-gradient-to-r from-blue-600 to-blue-400">
              {badgeText}
            </div>
          </div>
          <div>
            <h3 className="text-black text-lg">Description:</h3>
            <p>
              {DescriptionText}
              <p>{DescriptionText}</p>
            </p>
          </div>

          <WorkOrderForm assetId={assetId} />

          <h3 className="text-xl text-balck font-bold mt-5">Work Orders</h3>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetDetails;
