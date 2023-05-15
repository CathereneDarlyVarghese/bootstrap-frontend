import WorkorderButton from "components/widgets/WorkorderButton";
import React, { useState } from "react";

const WorkorderForm = ({ formOpen, setFormopen, notific }) => {
  const [data, setData] = useState({ name: "", type: "" });
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...data });
    setData({ name: "", type: "" });
  };
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
          method="post"
          onSubmit={handleSubmit}
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
                onChange={handleChange}
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
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="modal-action p-5 justify-start">
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
    </>
  );
};

export default WorkorderForm;
