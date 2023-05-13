import React from "react";

import image6 from "./Images/image6.jpeg";

<<<<<<< HEAD
const PendingOrders = ({ assetName, status, description, pendingImage }) => {
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
              className={`badge text-md ${
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
            <h3 className="text-lg font-bold">Type:</h3>
            <h3 className="text-lg font-bold">Description:</h3>
            <p>{description}</p>
=======
const PendingOrders = () => {
  return (
    //name, image, description, status, type
    <div
      className="card border border-blue-900 shadow-xl w-full my-5"
      style={{ height: "100%" }}
    >
      <div className="card-body flex flex-row">
        <div className="w-9/12">
          <div className="card-title">
            <h1>Appliance Name</h1>

            <div className="badge text-md">Pending</div>
          </div>
          <div>
            <h3 className="text-lg font-bold">Type:</h3>
            <h3 className="text-lg font-bold">Description:</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus
              imperdiet etiam. Sed pellentesque convallis diam sodales odio eget
              nec nibh dolor. Lorem ipsum dolor sit amet consectetur. Sed
            </p>
>>>>>>> d3ffcadd9dcc82071c5b694fe3d881761595c0ed
          </div>
        </div>
        <div className="w-3/12">
          <figure>
<<<<<<< HEAD
            <img
              src={pendingImage}
              alt="an image"
              className="rounded-xl h-full"
            />
=======
            <img src={image6} alt="an image" className="rounded-xl h-full" />
>>>>>>> d3ffcadd9dcc82071c5b694fe3d881761595c0ed
          </figure>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
