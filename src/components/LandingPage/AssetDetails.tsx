import React, { useState, useEffect } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import DubeButton from "components/widgets/Button";
import PendingOrders from "./PendingOrders";

import image6 from "./Images/image6.jpeg";

const workOrderStatus = {
  pending: "pending",
  open: "open",
  closed: "closed",
};
const dummyText =
  "Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus imperdiet etiam. Sed pellentesque convallis diam sodales odio eget nec nibh dolor. Lorem ipsum dolor sit amet consectetur.";

const AssetDetails = ({
  cardImage,
  cardTitle,
  badgeText,
  DescriptionText,
  openWorkOrderForm,
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

          <div className="card-actions">
            <WorkOrderButton
              title="Add Work Orders"
              workPending={true}
              onClick={openWorkOrderForm}
              buttonColor={"bg-blue-900"}
              hoverColor={"hover:bg-gradient-to-r from-blue-600 to-blue-400"}
            />
          </div>

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
            {console.log(pendingOrderDetails)}

            {/* <PendingOrders
              assetName={"Asset Name"}
              status={pendingOrderDetails.status}
              description={pendingOrderDetails.name}
              pendingImage={image6}
            />
            <PendingOrders
              assetName={"Asset Name"}
              status={workOrderStatus.closed}
              description={dummyText}
              pendingImage={image6}
            />
            <PendingOrders
              assetName={"Asset Name"}
              status={workOrderStatus.pending}
              description={dummyText}
              pendingImage={image6}
            />
            <PendingOrders
              assetName={"Asset Name"}
              status={workOrderStatus.closed}
              description={dummyText}
              pendingImage={image6}
            />
            <PendingOrders
              assetName={"Asset Name"}
              status={workOrderStatus.open}
              description={dummyText}
              pendingImage={image6}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetDetails;

// Right side card => using modal

// const AssetDetails = ({
//   modalOpen,
//   setModalopen,
//   modalImage,
//   openWorkOrderForm,
// }) => {
//   const openModal = () => {
//     modalOpen(true);
//   };
//   const closeModal = () => {
//     setModalopen(false);
//   };

//   return (
//     <>
//       {/* Modal on right side */}
//       <input
//         type="checkbox"
//         checked={modalOpen}
//         onChange={modalOpen ? openModal : closeModal}
//         id="my-modal-5"
//         className="modal-toggle"
//       />
//       <div className="modal flex justify-end p-0 m-0">
//         <div className="modal-box w-6/12 max-w-5xl h-full m-0">
//           <div className="flex flex-row">
//             <h3 className="font-bold text-3xl">Appliances</h3>
//             <div className="modal-action ml-auto m-0 p-0">
//               <label
//                 htmlFor="my-modal-5"
//                 className="bg-transparent text-black hover:bg-transparent border-none cursor-pointer"
//                 onClick={closeModal}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   strokeWidth="1.5"
//                   className="w-6 h-6 p-0"
//                 >
//                   <path
//                     d="M18 6L6 18M6 6l12 12"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </label>
//             </div>
//           </div>
//           <div>
//             <figure className="rounded-none">
//               <img
//                 src={modalImage}
//                 alt="an image"
//                 className="rounded-xl h-48 w-full my-5"
//               />
//             </figure>
//           </div>
//           <div className="card-body px-0 flex flex-row">
//             <h2
//               className="card-title w-2/3 font-bold"
//               style={{ color: "#232F3F" }}
//             >
//               Test Appliance two
//             </h2>
//             <button className="btn btn-xs btn-primary ml-auto">
//               Download QR
//             </button>
//             <button className="btn btn-xs btn-primary ml-auto">
//               Appliances
//             </button>
//           </div>
//           <div className="card-actions">
//             <h3 className="text-xl text-black font-bold">Description:</h3>
//             <p>
//               Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus
//               imperdiet etiam. Sed pellentesque convallis diam sodales odio eget
//               nec nibh dolor. Lorem ipsum dolor sit amet consectetur. Sed
//               convallis lorem purus imperdiet etiam. Sed pellentesque convallis
//               diam sodales odio eget nec nibh dolor. At sit commodo proin
//               pretium senectus sed ipsum id. dolor sit amet consectetur
//             </p>
//             <WorkOrderButton
//               title="Add Work Order"
//               workPending={true}
//               onClick={openWorkOrderForm}
//               buttonColor={"bg-blue-900"}
//               hoverColor={"hover:bg-blue-900"}
//             />
//           </div>
//           <div className="my-4">
//             <h1 className="font-bold text-xl">Pending Orders</h1>
//             <PendingOrders />
//           </div>
//         </div>
//       </div>

//       {/* Div on right side */}

//     </>
//   );
// };

// export default AssetDetails;
