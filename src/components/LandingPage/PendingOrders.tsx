import React from "react";

import image6 from "./Images/image6.jpeg";

const PendingOrders = ({
  assetName,
  status,
  description,
  pendingImage,
  orderType,
}) => {
  return (
    //name, image, description, status, type
    <div
      className="card border border-blue-900 bg-slate-100 shadow-xl w-full my-5"
      style={{ height: "100%" }}
    >
      <div className="card-body flex flex-row justify-between">
        <div className="w-9/12">
          <div className="flex flex-row justify-between card-title">
            <h1 className="text-blue-900">{assetName}</h1>

            <div
              className={`badge text-md uppercase ${
                status === "pending"
                  ? "badge-primary"
                  : status === "open"
                  ? "badge-secondary"
                  : "badge-success"
              }`}
            >
              {status}
            </div>
          </div>
          <div className="text-blue-900">
            <h3 className="text-lg font-bold">Type: {orderType}</h3>
            <h3 className="text-lg font-bold">Description:</h3>
            <p>{description}</p>
          </div>
        </div>
        <div className="w-3/12">
          <figure>
            <img
              src={pendingImage}
              alt="an image"
              className="rounded-xl h-full"
            />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
