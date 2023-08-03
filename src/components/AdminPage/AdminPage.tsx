import React, { useState, useEffect } from "react";
import { createAssetType, getAllAssetTypes } from "services/assetTypeServices";
import { Auth } from "aws-amplify";
import {
  createAssetCheckForm,
  getAssetCheckFormById,
} from "services/assetCheckFormServices";
import Form from "react-jsonschema-form";
// import "./AdminPage.module.css";
import { Helmet } from "react-helmet";
import "./MyStyle.css";
import { TfiClose } from "react-icons/tfi";

const uiSchema = {
  operational: {
    "ui:widget": "radio",
  },
  clean: {
    "ui:widget": "radio",
  },
};

const AdminPage = () => {
  const [token, setToken] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toggleContent, setToggleContent] = useState(0);
  const [qrOptions, setQrOptions] = useState(0);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [inputLocation, setInputLocation] = useState<string>("");
  const [assetType, setAssetType] = useState<string>("");

  const handleShow = () => setShowModal(true);

  const handleAddAssetType = async (e) => {
    e.preventDefault();

    if (assetType.trim() === "") {
      console.error("Asset type must not be empty");
      return;
    }

    try {
      const newAssetType = await createAssetType(token, {
        asset_type_id: "",
        asset_type: assetType,
      });
      console.log("Asset Type Created:", newAssetType);
      setAssetType("");
    } catch (error) {
      console.error("Error creating asset type:", error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      setToken(userData.signInUserSession.accessToken.jwtToken);

      try {
        const assetTypes1 = await getAllAssetTypes(
          userData.signInUserSession.accessToken.jwtToken
        );
        setAssetTypes(assetTypes1);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getAssetCheckFormById(token, selectedAssetType);
        console.log("Returned form object:", form); // Debugging line
        setJsonForm(form.form_json); // Adjust this line according to your returned data structure
        handleShow();
      } catch (error) {
        if (error.response?.status === 404) {
          try {
            const newForm = await createAssetCheckForm(token, {
              form_json: {},
              asset_type_id: selectedAssetType,
            });
            setJsonForm(newForm.form_json); // Adjust this line according to your returned data structure
            handleShow();
          } catch (error) {
            console.error("Failed to create a new form:", error);
          }
        } else {
          console.error("Failed to fetch form:", error);
        }
      }
    };

    if (selectedAssetType) {
      fetchForm();
    }
  }, [selectedAssetType, token]);

  return (
    <div className="admin-page flex flex-row">
      <Helmet>
        <script src="https://unpkg.com/react-jsonschema-form/dist/react-jsonschema-form.js"></script>
      </Helmet>
      <div className="w-1/5 bg-gray-200 h-screen p-5">
        <div className="flex flex-col gap-5 items-start">
          <button
            className="font-sans text-black font-semibold"
            onClick={() => {
              setToggleContent(0);
              setQrOptions(0);
            }}
          >
            Show Forms
          </button>
          <button
            className="font-sans text-black font-semibold"
            onClick={() => {
              setToggleContent(1);
              setQrOptions(0);
            }}
          >
            Add Asset Type
          </button>
          <button
            className="font-sans text-black font-semibold"
            onClick={() => {
              setToggleContent(2);
              setQrOptions(0);
            }}
          >
            Get All QR Codes
          </button>
        </div>
      </div>
      <div className="w-4/5">
        {toggleContent === 0 ? (
          <div>
            <div className="flex flex-col justify-center">
              {/* <h1 className="mx-auto my-3">Select Form</h1> */}
              {/* <button className="btn bg-blue-900 hover:bg-blue-900 w-fit mx-auto my-3" onClick={() => setShowForm(true)}>Add Asset Type</button> */}

              <select
                value={selectedAssetType}
                onChange={(e) => setSelectedAssetType(e.target.value)}
                className="select border border-slate-300 w-5/12 mx-auto my-5"
              >
                {assetTypes.map((type) => (
                  <option
                    key={type.asset_type_id}
                    value={type.asset_type_id}
                    className="text-black"
                  >
                    {type.asset_type}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 70 }}>
              {jsonForm && <Form schema={jsonForm} />}
            </div>
          </div>
        ) : toggleContent === 1 ? (
          <div className="flex flex-col items-center mt-10 ">
            <div className="w-1/2 p-5 border border-slate-200 rounded-lg">
              <div className="flex flex-row items-center">
                <h3 className="font-bold text-lg">Add Asset Type</h3>
              </div>
              <form>
                <input
                  type="text"
                  required
                  placeholder="Enter Asset Type"
                  className="input input-sm w-full border border-slate-300 my-5"
                  value={assetType}
                  onChange={(e) => {
                    setAssetType(e.target.value);
                    console.log("Asset Type:", e.target.value);
                  }}
                />
                <div className="flex flex-row justify-center">
                  <button
                    onClick={handleAddAssetType}
                    className="btn btn-sm bg-blue-900 hover:bg-blue-900"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-5 items-center justify-center p-5">
              <button className="btn bg-blue-900 hover:bg-blue-900 w-64">
                Print All QR Codes
              </button>
              <button
                className="btn bg-blue-900 hover:bg-blue-900 w-64"
                onClick={() => {
                  setQrOptions(1);
                }}
              >
                Select QR Codes to print
              </button>
            </div>
            <div>
              {qrOptions === 1 ? (
                <div className="flex flex-col items-center">
                  {/* Map asset names inside this */}
                  <label className="label cursor-pointer w-3/12">
                    <span className="label-text">Dishwasher</span>
                    <input type="checkbox" className="checkbox" />
                  </label>
                  <label className="label cursor-pointer w-3/12">
                    <span className="label-text">
                      Automatic Espresso Machine
                    </span>
                    <input type="checkbox" className="checkbox" />
                  </label>
                  <label className="label cursor-pointer w-3/12">
                    <span className="label-text">Oven</span>
                    <input type="checkbox" className="checkbox " />
                  </label>
                  <label className="label cursor-pointer w-3/12">
                    <span className="label-text">Oven</span>
                    <input type="checkbox" className="checkbox " />
                  </label>
                  {/* Map asset names inside this */}
                  <div className="flex flex-row gap-2">
                    <button
                      className="btn btn-sm capitalize bg-blue-900 hover:bg-blue-900 w-fit flex flex-row justify-start"
                      onClick={() => {
                        setQrOptions(0);
                      }}
                    >
                      Clear Selection
                    </button>
                    <button className="btn btn-sm capitalize bg-blue-900 hover:bg-blue-900 w-fit flex flex-row justify-start">
                      Print
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}

        {/* add asset type */}
      </div>
    </div>
  );
};

export default AdminPage;
