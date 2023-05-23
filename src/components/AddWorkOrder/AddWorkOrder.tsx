import { Button, Title, FlexBox } from "@ui5/webcomponents-react";
import { FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { WorkOrder } from "types";
import { WorkOrderStatuses, WorkOrderTypes } from "../../enums";
import { uploadFiletoS3 } from "utils";
import { addWorkOrder } from "services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddWorkOrderProps {}

const AddWorkOrder: FC<AddWorkOrderProps> = () => {
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

  return (
    <>
      <FlexBox alignItems="Center">
        <Button className="btn mr-6 btn-sm" onClick={() => navigate("/")}>
          Back
        </Button>
        <Title>Add Work Order</Title>
      </FlexBox>

      <div className="flex flex-col items-center">
        <form
          className="w-full max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Name
              </label>
              <input
                required
                onChange={(e) =>
                  setData((curr) => ({ ...curr, name: e.target.value }))
                }
                value={data.name}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
              />
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Description
              </label>
              <textarea
                required
                onChange={(e) =>
                  setData((curr) => ({ ...curr, description: e.target.value }))
                }
                value={data.description}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Type
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
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
              />
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Photo
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input file-input-bordered file-input-sm appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
          <div className=" text-center">
            <button
              type="submit"
              onClick={() => {
                console.log(data);
              }}
              className="btn"
            >
              Submit Work Order
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddWorkOrder;
