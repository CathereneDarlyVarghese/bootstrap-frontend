import React from "react";
import WorkorderButton from "components/widgets/WorkorderButton";
import DubeButton from "components/widgets/Button";
import PendingOrders from "./PendingOrders";

const AssetDetails = ({
  modalOpen,
  setModalopen,
  modalImage,
  openWorkorderForm,
}) => {
  const openModal = () => {
    modalOpen(true);
  };
  const closeModal = () => {
    setModalopen(false);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={modalOpen}
        onChange={modalOpen ? openModal : closeModal}
        id="my-modal-5"
        className="modal-toggle"
      />
      <div className="modal flex justify-end p-0 m-0">
        <div className="modal-box w-6/12 max-w-5xl h-full m-0">
          <div className="flex flex-row">
            <h3 className="font-bold text-3xl">Appliances</h3>
            <div className="modal-action ml-auto m-0 p-0">
              <label
                htmlFor="my-modal-5"
                className="bg-transparent text-black hover:bg-transparent border-none cursor-pointer"
                onClick={closeModal}
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth="1.5"
                  className="w-6 h-6 p-0"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </label>
            </div>
          </div>
          <div>
            <figure className="rounded-none">
              <img
                src={modalImage}
                alt="an image"
                className="rounded-xl h-48 w-full my-5"
              />
            </figure>
          </div>
          <div className="card-body px-0 flex flex-row">
            <h2
              className="card-title w-2/3 font-bold"
              style={{ color: "#232F3F" }}
            >
              Test Appliance two
            </h2>
            <button className="btn btn-xs btn-primary ml-auto">
              Download QR
            </button>
            <button className="btn btn-xs btn-primary ml-auto">
              Appliances
            </button>
          </div>
          <div className="card-actions">
            <h3 className="text-xl text-black font-bold">Description:</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus
              imperdiet etiam. Sed pellentesque convallis diam sodales odio eget
              nec nibh dolor. Lorem ipsum dolor sit amet consectetur. Sed
              convallis lorem purus imperdiet etiam. Sed pellentesque convallis
              diam sodales odio eget nec nibh dolor. At sit commodo proin
              pretium senectus sed ipsum id. dolor sit amet consectetur
            </p>
            <WorkorderButton
              title="Add Work Order"
              workPending={true}
              onClick={openWorkorderForm}
              buttonColor={"bg-blue-900"}
              hoverColor={"hover:bg-blue-900"}
            />
          </div>
          <div className="my-4">
            <h1 className="font-bold text-xl">Pending Orders</h1>
            <PendingOrders />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetDetails;
