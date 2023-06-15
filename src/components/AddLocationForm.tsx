import React, { useEffect, useState } from "react";
import { createAssetLocation } from "../services/locationServices";
import { Auth, Hub } from "aws-amplify";
import { AssetLocation } from "types";

const AddLocationForm = ({ addLocationForm, setAddLocationForm }) => {
  const [inputLocation, setInputLocation] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await Auth.currentAuthenticatedUser();
      const token = userData.signInUserSession.accessToken.jwtToken;
      setSessionToken(token);
      const assetLocationObj: AssetLocation = {
        location_id: "",
        location_name: inputLocation,
      };
      await createAssetLocation(token, assetLocationObj);
    } catch (error) {
      console.log(error);
    }

    setAddLocationForm(false);
  };

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
          <form method="post" onSubmit={handleSubmit}>
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
                  onChange={(e) => setInputLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Modal action */}
            <div className=" m-0 p-5 flex justify-center gap-5">
              <div>
                <button
                  className="btn bg-blue-900 hover:bg-blue-900"
                  type="submit"
                >
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
