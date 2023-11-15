import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAsset } from 'services/apiServices';

const WorkOrdersPage = () => {
  const [asset, setAsset] = useState(null);
  // const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('assetId');
  // const [searchTerm, setSearchTerm] = useState(""); // new state for search term

  useEffect(() => {
    (async () => {
      if (assetId) {
        const sessionToken = window.localStorage.getItem('sessionToken');
        if (sessionToken) {
          const fetchedAsset = await getAsset(sessionToken, assetId);
          setAsset(fetchedAsset);
        }
      }
    })();
  }, [assetId, asset]);

  return (
    <div className="flex flex-row justify-center h-screen items-center bg-white dark:bg-black">
      <h1 className="text-black dark:text-gray-300 text-3xl font-sans font-semibold mb-10">
        Page Coming Soon
      </h1>
    </div>
    // <div
    //   className="bg-primary-content h-full"
    //   style={{ display: "flex", flexDirection: "row" }}
    // >

    //   <div
    //     className="w-1/3 h-5/6 rounded-xl p-2 overflow-y-auto lg:w-full"
    //     id="style-7"
    //   >
    //     <div
    //       style={{ display: "flex", flexDirection: "row" }}
    //       className="items-center justify-center mb-2"
    //     >
    //       <div className="flex flex-row items-center bg-gray-100 rounded-xl w-full">
    //         <button>
    //           <img
    //             src={SearchIcon}
    //             className="h-fit justify-center items-center ml-3"
    //           />
    //         </button>
    //         <input
    //           type="text"
    //           placeholder="Search Appliance"
    //           onChange={(e) => setSearchTerm(e.target.value)} // update search term
    //           className="w-4/5 h-12 p-5 bg-gray-100 placeholder-blue-700 text-blue-700 text-sm border-none font-sans"
    //         />
    //       </div>
    //       <button className="btn w-28 h-fit ml-3 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none">
    //         + Add
    //       </button>
    //     </div>

    //     <div
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {
    //         addClass("#style-8", "lg:w-full");
    //         addClass("#style-7", "lg:hidden");
    //         removeClass("#style-8", "lg:hidden");
    //       }}
    //     >
    //       <WorkOrderCard
    //         WorkOrderStatus="closed"
    //         WorkOrderName="First Work Order"
    //         WorkOrderDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor ex, mattis quis hendrerit id, pellentesque vel quam. Vivamus fringilla"
    //       />
    //     </div>
    //     <div
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {
    //         addClass("#style-8", "lg:w-full");
    //         addClass("#style-7", "lg:hidden");
    //         removeClass("#style-8", "lg:hidden");
    //       }}
    //     >
    //       <WorkOrderCard
    //         WorkOrderStatus="closed"
    //         WorkOrderName="Second Work Order"
    //         WorkOrderDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor ex, mattis quis hendrerit id, pellentesque vel quam. Vivamus fringilla"
    //       />
    //     </div>
    //     <div
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {
    //         addClass("#style-8", "lg:w-full");
    //         addClass("#style-7", "lg:hidden");
    //         removeClass("#style-8", "lg:hidden");
    //       }}
    //     >
    //       <WorkOrderCard
    //         WorkOrderStatus="closed"
    //         WorkOrderName="Third Work Order"
    //         WorkOrderDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor ex, mattis quis hendrerit id, pellentesque vel quam. Vivamus fringilla"
    //       />
    //     </div>
    //     <div
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {
    //         addClass("#style-8", "lg:w-full");
    //         addClass("#style-7", "lg:hidden");
    //         removeClass("#style-8", "lg:hidden");
    //       }}
    //     >
    //       <WorkOrderCard
    //         WorkOrderStatus="closed"
    //         WorkOrderName="Third Work Order"
    //         WorkOrderDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor ex, mattis quis hendrerit id, pellentesque vel quam. Vivamus fringilla"
    //       />
    //     </div>
    //   </div>
    //   <div
    //     className="w-2/3 h-6/6 p-2 overflow-y-auto bg-gray-200 lg:hidden"
    //     id="style-8"
    //   >

    //     <WorkOrderDetails
    //       closeAsset={() => {
    //         addClass("#style-8", "lg:hidden");
    //         removeClass("#style-8", "w-full");
    //         removeClass("#style-7", "lg:hidden");
    //       }}
    //       workOrder={selectedWorkOrder}
    //       setSelectedWorkOrder={setSelectedWorkOrder}
    //     />
    //   </div>
    // </div>
  );
};

export default WorkOrdersPage;
