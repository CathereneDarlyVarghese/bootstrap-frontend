import React from "react";

const AddLocationForm = ({ addLocationForm, setAddLocationForm }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={addLocationForm}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box p-0 w-full sm:mx-2">
          <form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              setAddLocationForm(false);
            }}
          >
            {/* Modal header */}
            <div className="p-5 bg-white flex flex-row">
              <h3 className="font-sans font-bold text-lg text-blue-800">
                Add New Location
              </h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-blue-800 ml-auto cursor-pointer"
                onClick={() => {
                  setAddLocationForm(false);
                }}
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="flex flex-col p-5">
              <div>
                <label className="font-sans font-semibold text-black text-sm">
                  Location Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Location Name"
                  required
                  className="input input-bordered input-sm text-sm w-full my-3 font-sans"
                />
              </div>
            </div>

            {/* Modal action */}
            <div className=" m-0 p-5 flex justify-center gap-5">
              <div>
                <button className="btn bg-blue-900 hover:bg-blue-900">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLocationForm;
