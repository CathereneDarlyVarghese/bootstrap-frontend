import React, { useEffect, useState } from "react";
import AssetCard from "../LandingPage/AssetCard";
import AssetDetails from "../LandingPage/AssetDetails";
import AddAssetForm from "../LandingPage/AddAssetForm";
import SearchIcon from "../../icons/circle2017.png";
import WorkOrderCard from "./WorkOrderCard";
import WorkOrderDetails from "./WorkOrderDetails";
import { useSearchParams } from "react-router-dom";
import { getAsset } from "services/apiServices";

const WorkOrdersPage = (props: any) => {
  const [asset, setAsset] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get("assetId");
  const [searchTerm, setSearchTerm] = useState(""); // new state for search term

  useEffect(() => {
    console.log("Search term is: ", searchTerm); // log search term
  }, [searchTerm]);

  useEffect(() => {
    (async () => {
      if (assetId) {
        const sessionToken = window.localStorage.getItem("sessionToken");
        if (sessionToken) {
          const fetchedAsset = await getAsset(sessionToken, assetId);
          setAsset(fetchedAsset);
        }
      } else {
        console.error("Asset ID is not provided");
      }
    })();
  }, [assetId]);

  return (
    <div
      className="bg-primary-content h-full"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div
        className="w-1/3 h-5/6 rounded-xl p-2 overflow-y-auto lg:w-full"
        id="style-7"
      >
        <div
          style={{ display: "flex", flexDirection: "row" }}
          className="items-center justify-center mb-2"
        >
          <div className="flex flex-row items-center bg-gray-100 rounded-xl w-full">
            <button>
              <img
                src={SearchIcon}
                className="h-fit justify-center items-center ml-3"
              />
            </button>
            <input
              type="text"
              placeholder="Search Appliance"
              onChange={(e) => setSearchTerm(e.target.value)} // update search term
              className="w-4/5 h-12 p-5 bg-gray-100 placeholder-blue-700 text-blue-700 text-sm border-none font-sans"
            />
          </div>
          <button className="btn w-28 h-fit ml-3 text-sm font-sans font-medium capitalize bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none">
            + Add
          </button>
        </div>
        {asset?.workOrders
          .filter(
            (workOrder) =>
              workOrder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              workOrder.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
          .map((workOrder) => (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedWorkOrder(workOrder)}
            >
              <WorkOrderCard
                WorkOrderStatus={workOrder.status}
                WorkOrderName={workOrder.name}
                WorkOrderDescription={workOrder.description}
              />
            </div>
          ))}
      </div>
      <div
        className="w-2/3 h-6/6 p-2 overflow-y-auto bg-gray-200 lg:hidden"
        id="style-7"
      >
        {selectedWorkOrder && (
          <WorkOrderDetails
            workOrder={selectedWorkOrder}
            setSelectedWorkOrder={setSelectedWorkOrder}
          />
        )}
      </div>
    </div>
  );
};

export default WorkOrdersPage;
