import React, { useState } from "react";
import WorkorderButton from "components/widgets/WorkorderButton";

const AddAssetForm = ({ addAssetOpen, setAddAssetOpen }) => {
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
        <div className="modal-box p-0 w-full" style={{ height: "80%" }}>
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
              <input
                type="text"
                id="type"
                placeholder="Type"
                onChange={handleChange}
                value={data.applianceType}
                className="input input-bordered input-info w-full my-3"
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
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="btn w-48 bg-blue-900 hover:bg-blue-900"
                  onClick={toggleDropDown}
                >
                  {location}
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                  </svg>
                </label>
                {dropdownOpen && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li
                      className="btn bg-transparent text-black border-none hover:bg-transparent normal-case  font-normal text-lg w-full flex-row justify-start"
                      onClick={() => {
                        setLocation("San Franciso");
                        setDropdownopen(!dropdownOpen);
                      }}
                    >
                      San Franciso
                    </li>
                    <li
                      className="btn bg-transparent text-black border-none hover:bg-transparent normal-case font-normal text-lg w-full flex-row justify-start"
                      onClick={() => {
                        setLocation("Singapore");
                        setDropdownopen(!dropdownOpen);
                      }}
                    >
                      Singapore
                    </li>
                    <li
                      className="btn bg-transparent text-black border-none hover:bg-transparent normal-case font-normal text-lg w-full flex-row justify-start"
                      onClick={() => {
                        setLocation("India");
                        setDropdownopen(!dropdownOpen);
                      }}
                    >
                      India
                    </li>
                    <li
                      className="btn bg-transparent text-black border-none hover:bg-transparent normal-case  font-normal text-lg w-full flex-row justify-start"
                      onClick={() => {
                        setLocation("China");
                        setDropdownopen(!dropdownOpen);
                      }}
                    >
                      China
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="modal-action p-5">
              <WorkorderButton
                title="Submit"
                workPending={false}
                onClick={handleSubmit}
                buttonColor={"bg-blue-900"}
                hoverColor={"hover:bg-blue-900"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAssetForm;
