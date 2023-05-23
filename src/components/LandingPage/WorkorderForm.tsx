import React, { useState, useEffect, useMemo } from "react";
import WorkorderButton from "components/widgets/WorkorderButton";

import { uploadFiletoS3 } from "utils";
import { AssetTypes } from "enums";
import { Asset } from "types";
import { useNavigate, useLocation } from "react-router-dom";
import { addInventory } from "services/apiServices";
import { toast } from "react-toastify";
import { addWorkOrder } from "services/apiServices";
import { WorkOrder } from "types";
import { WorkOrderStatuses, WorkOrderTypes } from "../../enums";

const WorkorderForm = ({ formOpen, setFormopen, notific }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [token, settoken] = useState<string>("");
  const [file, setFile] = useState<any>();
  const [inventoryId, setInventoryId] = useState<string | undefined>("");

  const [data, setData] = useState<WorkOrder>({
    Id: "",
    name: "",
    image: "",
    description: "",
    type: WorkOrderTypes.Appliances,
    status: WorkOrderStatuses.Open,
  });

  const handleSubmit = async () => {
    console.log(data);
    try {
      const imageLocation = await uploadFiletoS3(file, "work-order");
      console.log("Image Location ==>>", imageLocation);
      data.image = imageLocation.location;
      await addWorkOrder(token, inventoryId, data);
      toast.success("Work Order added Successfuly", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      alert("something went wrong!");
    }
  };

  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    settoken(data);
    const assetId = location.state?.assetId as string;
    setInventoryId(assetId); // set inventoryId from location state
    console.log("assetId ==>>", assetId); // log the assetId
  }, [location.state]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const closeForm = () => {
    setFormopen(false);
  };
  const openForm = () => {
    setFormopen(true);
  };

  return (
    <>
      <input
        type="checkbox"
        id="my-modal-4"
        checked={formOpen}
        onChange={formOpen ? openForm : closeForm}
        className="modal-toggle"
      />
      <div className="modal">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="w-4/12 max-w-5xl p-0"
        >
          <div className="modal-box p-0">
            <div className="bg-blue-900 p-5 m-0 flex flex-row">
              <div>
                <h3 className="font-bold text-lg text-white flex justify-center">
                  Add Work Order
                </h3>
              </div>
              <div className="ml-auto cursor-pointer" onClick={closeForm}>
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth="1.5"
                  className="w-6 h-6 text-white"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col p-5">
              <input
                type="text"
                required
                placeholder="Name"
                className="input input-bordered input-info w-full my-3"
                onChange={(e) =>
                  setData((curr) => ({ ...curr, name: e.target.value }))
                }
                value={data.name}
              />
              {/* <input
                type="text"
                name="type"
                placeholder="Type"
                className="input input-bordered input-info w-full my-5"
                onChange={handleChange}
                value={data.type}
              /> */}
              {/* <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Type
              </label> */}
              <input
                required
                onChange={(e) =>
                  setData((curr) => ({
                    ...curr,
                    type: e.target.value as WorkOrderTypes,
                  }))
                }
                value={data.type}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 my-5"
                type="text"
              />
              <textarea
                onChange={(e) =>
                  setData((curr) => ({ ...curr, description: e.target.value }))
                }
                required
                className="textarea textarea-bordered textarea-info my-3"
                placeholder="Description"
                value={data.description}
              />
              <label
                htmlFor="file_input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                <input
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-lg text-white border border-gray-300 rounded-lg cursor-pointer bg-blue-900 dark:text-black focus:outline-none dark:bg-white dark:border-info dark:placeholder-white file:bg-blue-900 file:text-white my-3"
                  style={{}}
                />
              </label>
            </div>
            <div className="modal-action p-5 flex flex-row justify-center">
              <div>
                <WorkorderButton
                  title="Submit"
                  workPending={false}
                  onClick={() => {
                    console.log("Submit button clicked");
                  }}
                  buttonColor={"bg-blue-900"}
                  hoverColor={"hover:bg-blue-900"}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default WorkorderForm;
