import React, { useState, useEffect } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import DubeButton from "components/widgets/Button";
import PendingOrders from "./PendingOrders";

import image6 from "./Images/image6.jpeg";
import closeIcon from "../../icons/closeIcon.svg";
import Add from "../../icons/Add.png";

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
  assetType,
  DescriptionText,
  openWorkOrderForm,
  pendingOrderDetails,
}) => {
  return (
    <>
      <div className="h-5/6 mx-4 mt-2 p-5 bg-white border-blue-900 rounded-xl">
        <div className="flex flex-row">
          <h1 className="font-sans font-bold text-xl capitalize">
            {assetType}
          </h1>
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
              className="flex text-gray-800 text-xl font-semibold font-sans tracking-wide xl:text-sm w-2/3"
              style={{ wordSpacing: 3 }}
            >
              {cardTitle}
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
            <h3 className="text-blue-900 font-sans font-semibold  text-md">
              More Information:
            </h3>
            <p>{DescriptionText}</p>
          </div>

          <div className="card-actions flex flex-row ml-auto">
            <WorkOrderButton
              title="Delete Work Orders"
              workPending={false}
              onClick={() => {
                console.log("Delete button clicked");
              }}
              buttonColor={"bg-blue-900"}
              // hoverColor={"hover:bg-gradient-to-r from-blue-600 to-blue-400"}
              hoverColor={"hover:bg-blue-900"}
            />
            <WorkOrderButton
              // title="+ Add Work Orders"
              title={<img src={Add} style={{ color: "#fff" }} />}
              workPending={false}
              onClick={openWorkOrderForm}
              buttonColor={"bg-transparent border-none"}
              // hoverColor={"hover:bg-gradient-to-r from-blue-600 to-blue-400"}
              hoverColor={"hover:bg-transparent"}
            />
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
            {console.log(pendingOrderDetails)}
          </div> */}
          {/* Pending Orders List */}
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
