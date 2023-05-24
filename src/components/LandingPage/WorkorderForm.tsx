import { FC, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { uploadFiletoS3 } from "utils";
import { WorkOrderTypes, WorkOrderStatuses } from "enums";
import { Asset, WorkOrder } from "types";
import { useNavigate } from "react-router-dom";
import { addWorkOrder } from "services/apiServices";
import { toast } from "react-toastify";

interface AddWorkOrderProps {assetId: Asset["id"]}

const WorkOrderForm: FC<AddWorkOrderProps> = (props) => {
  let assetId = props.assetId;
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
    assetId =  props.assetId as string;
    // console.log("location.state?.assetId ==>>", location.state?.assetId)
    setInventoryId(assetId); // set inventoryId from location state
    console.log("assetId WO ==>>", assetId); // log the assetId
  }, [assetId]);

  return (
    <div className="flex justify-end">
      <label
        htmlFor="my-modal-3"
        className="btn w-fit bg-blue-900 border-none text-slate-200 hover:bg-gradient-to-r from-blue-600 to-blue-400 hover:text-white"
      >
        Add Work Order
      </label>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative w-1/4 h-5/6 py-16">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2 bg-blue-900 border-none hover:bg-gradient-to-r from-blue-600 to-blue-400"
          >
            ✕
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col space-y-8"
          >
            <input
              required
              onChange={(e) =>
                setData((curr) => ({ ...curr, name: e.target.value }))
              }
              value={data.name}
              type="text"
              placeholder="Work Order Name"
              className="input input-bordered w-full max-w-xs"
            />

            <textarea
              required
              onChange={(e) =>
                setData((curr) => ({ ...curr, description: e.target.value }))
              }
              value={data.description}
              placeholder="Description"
              className="input input-bordered w-full max-w-xs"
            />

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
              className="input input-bordered w-full max-w-xs"
            />

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input w-full max-w-xs"
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
