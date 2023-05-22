import React, { useState, useEffect } from "react";
import WorkorderButton from "components/widgets/WorkorderButton";

import { uploadFiletoS3 } from "utils";
import { AssetTypes } from "enums";
import { Asset } from "types";
import { useNavigate } from "react-router-dom";
import { addInventory } from "services/apiServices";
import { toast } from "react-toastify";

const WorkorderForm = ({ formOpen, setFormopen, notific }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const navigate = useNavigate();
  const [token, settoken] = useState<string>("");
  const [file, setFile] = useState<any>();
  const [data, setData] = useState<Asset>({
    organization: {
      name: "testorg1",
      id: "2",
      members: [],
    },
    orgId: "2",
    audit: {
      createdAt: "test",
      createdBy: "test",
    },
    id: "2",
    name: "",
    imageS3: "",
    location: "tsd",
    workOrders: [],
    type: AssetTypes.Appliances,
  });

  const handleSubmit = async () => {
    console.log(data);
    try {
      const imageLocation = await uploadFiletoS3(file, "inventory");
      console.log(imageLocation);
      data.imageS3 = imageLocation.location;
      console.log("Location on submit ==>>", data.location);
      await addInventory(token, data)
        .then(() => {
          toast.success("Asset Added Succesfully", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // navigate(`/location?name=${data.location}`); // Navigate to the page of the location
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
  }, []);

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
                name="name"
                placeholder="Name"
                className="input input-bordered input-info w-full my-3"
                onChange={(e) =>
                  setData((curr) => ({ ...curr, name: e.target.value }))
                }
                value={data.name}
              />
              <input
                type="text"
                name="type"
                placeholder="Type"
                className="input input-bordered input-info w-full my-5"
                onChange={handleChange}
                value={data.type}
              />
              <textarea
                className="textarea textarea-bordered textarea-info my-3"
                placeholder="Description"
              />
              <label className="btn bg-blue-900 hover:bg-blue-900 w-full">
                {image ? image.name : "Select image"}
                <input
                  type="file"
                  placeholder="Image"
                  className="hidden w-full my-5"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
            <div className="modal-action p-5 flex flex-row justify-center">
              <div>
                <WorkorderButton
                  title="Submit"
                  workPending={false}
                  onClick={notific}
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
