import { FC, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { uploadFiletoS3 } from "utils";
import { WorkOrderTypes, WorkOrderStatuses } from "enums";
import { Asset, WorkOrder } from "types";
import { useNavigate } from "react-router-dom";
import { addWorkOrder } from "services/apiServices";
import { toast } from "react-toastify";

import { AiOutlineFileAdd } from "react-icons/ai";

interface AddWorkOrderProps {
  assetId1: Asset["asset_id"];
  closeModal: () => void;
}

const WorkOrderForm: FC<AddWorkOrderProps> = ({ assetId1, closeModal }) => {
  let assetId = assetId1;
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

      console.log("Location on submit ==>>", data.image);
      closeModal();
      await addWorkOrder(token, inventoryId, data)
        .then(() => {
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
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      alert("something went wrong!");
    }
  };

  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    settoken(data);
    assetId = assetId1 as string;
    setInventoryId(assetId); // set inventoryId from location state
    console.log("assetId WO ==>>", assetId); // log the assetId
  }, [assetId]);

  return (
    <div className="flex justify-end">
      <label
        htmlFor="my-modal-3"
        className="btn w-fit mx-3 bg-transparent text-slate-800 border-none hover:bg-transparent"
      >
        <AiOutlineFileAdd className="text-black dark:text-white" style={{ fontSize: 25 }} />

        {/* Add Work Order */}
      </label>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative p-5 h-fit px-5">
          <div className="flex flex-row mb-5">
            <h1 className="font-sans font-bold text-lg text-blue-800">
              Add Work Order
            </h1>
            <label
              htmlFor="my-modal-3"
              className="btn btn-sm btn-circle ml-auto bg-blue-900 border-none hover:bg-gradient-to-r from-blue-600 to-blue-400"
            >
              ✕
            </label>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col"
          >
            <label className="font-sans font-semibold text-black text-sm">
              Work Order Name
            </label>
            <input
              required
              onChange={(e) =>
                setData((curr) => ({ ...curr, name: e.target.value }))
              }
              value={data.name}
              type="text"
              placeholder="Work Order Name"
              className="input input-bordered w-full my-3"
            />
            <label className="font-sans font-semibold text-black text-sm">
              Description
            </label>
            <textarea
              required
              onChange={(e) =>
                setData((curr) => ({ ...curr, description: e.target.value }))
              }
              value={data.description}
              placeholder="Description"
              className="input input-bordered w-full my-3"
            />
            <label className="font-sans font-semibold text-black text-sm">
              Asset Type
            </label>
            <input
              required
              onChange={(e) =>
                setData((curr) => ({
                  ...curr,
                  type: e.target.value as WorkOrderTypes,
                }))
              }
              value={data.type}
              type="text"
              placeholder="Work Order Name"
              className="input input-bordered w-full my-3"
            />
            <label className="font-sans font-semibold text-black text-sm">
              Add Image
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white my-3"
            />

            <input
              onClick={() => {
                console.log(data);
              }}
              type="submit"
              value="Submit"
              className="btn w-fit mx-auto bg-blue-900 border-none text-slate-200 hover:bg-gradient-to-r from-blue-600 to-blue-400 hover:text-white"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderForm;
