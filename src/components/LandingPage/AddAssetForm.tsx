import React, { useState } from "react";
import WorkorderButton from "components/widgets/WorkorderButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAssetForm = ({ addAssetOpen, setAddAssetOpen, notific }) => {
  const [location, setLocation] = useState("Location");
  const [dropdownOpen, setDropdownopen] = useState(false);
  const [image, setImage] = useState(null);
  const [data, setData] = useState({ applianceName: "", applianceType: "" });

  const openAddForm = () => {
    setAddAssetOpen(true);
  };
  const closeAddForm = () => {
    setAddAssetOpen(false);
  };

  const toggleDropDown = () => {
    setDropdownopen(!dropdownOpen);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    setData({ applianceName: "", applianceType: "" });
    setAddAssetOpen(false);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={addAssetOpen}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box p-0 w-full">
          <form method="post" onSubmit={handleSubmit}>
            <div className="p-5 bg-blue-900 flex flex-row">
              <h3 className="font-bold text-white font-bold">Add Assets</h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-white ml-auto cursor-pointer"
                onClick={closeAddForm}
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex flex-col p-5">
              <input
                type="text"
                id="name"
                placeholder="Name"
                onChange={handleChange}
                // value={data.applianceName || ""}
                value={data.applianceName}
                className="input input-bordered input-info w-full my-3"
              />
              <div className="my-3 flex flex-row items-center">
                <input
                  type="radio"
                  id="type"
                  placeholder="Type"
                  onChange={handleChange}
                  value={data.applianceType}
                  // className="input input-bordered input-info w-full my-3"
                  className="radio radio-sm checked:bg-blue-900"
                  style={{
                    borderColor: "#0D47A1",
                    // backgroundColor: "#0D47A1",
                  }}
                />
                <span className="label-text text-lg mx-3">Appliance</span>
              </div>

              <textarea
                className="textarea textarea-bordered textarea-info"
                placeholder="Description"
              />
              <label className="btn bg-blue-900 hover:bg-blue-900 w-full my-5">
                {image ? image.name : "Select Image"}
                <input
                  type="file"
                  placeholder="Name"
                  className="hidden input input-bordered input-info w-full my-3"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              {/* Location dropdown */}
              <select className="select select-bordered select-info w-full">
                <option disabled selected>
                  Location
                </option>
                <option>Singapore</option>
                <option>San Franciso</option>
                <option>India</option>
                <option>China</option>
              </select>
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
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAssetForm;
