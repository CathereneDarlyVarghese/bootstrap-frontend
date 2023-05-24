import { FC, useState, useEffect, useMemo } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import { useLocation } from "react-router-dom";
import { uploadFiletoS3 } from "utils";
import { WorkOrderTypes, WorkOrderStatuses } from "enums";
import { Asset, WorkOrder } from "types";
import { useNavigate } from "react-router-dom";
import { addWorkOrder } from "services/apiServices";
import { toast } from "react-toastify";

interface AddWorkOrderProps {}

const WorkOrderForm: FC<AddWorkOrderProps> = () => {
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

      console.log("data.Id -> ", data.Id);

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
    const assetId = location.state?.assetId as string;
    setInventoryId(assetId); // set inventoryId from location state
    console.log("assetId ==>>", assetId); // log the assetId
  }, [location.state]);
  return(
  <>
  </>
  );
};

export default WorkOrderForm;
