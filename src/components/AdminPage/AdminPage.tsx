import React, { useState, useEffect } from "react";
import { getAllAssetTypes } from "services/assetTypeServices";
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
  "operational": {
    "ui:widget": "radio"
  },
  "clean": {
    "ui:widget": "radio"
  }
}

const AdminPage = () => {
  const [token, setToken] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleShow = () => setShowModal(true);

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
    <div className="admin-page">
      <Helmet>
        <script src="https://unpkg.com/react-jsonschema-form/dist/react-jsonschema-form.js"></script>
      </Helmet>
      <div>
        <div className="flex flex-col justify-center">
          {/* <h1 className="mx-auto my-3">Select Form</h1> */}
          <button className="btn bg-blue-900 hover:bg-blue-900 w-fit mx-auto my-3" onClick={() => setShowForm(true)}>Add Asset Type</button>

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

        {/* add asset type */}
        <div>
          <input type="checkbox" checked={showForm} id="my_modal_6" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <div className="flex flex-row items-center">
                <h3 className="font-bold text-lg">Add Asset Type</h3>
                <button className="ml-auto" onClick={() => setShowForm(false)}>
                  <TfiClose />
                </button>
              </div>
              <form>
                <input type="text" required placeholder="Enter Asset Type" className="input input-sm w-full border border-slate-300 my-5" />
                <div className="flex flex-row justify-center">
                  <button className="btn btn-sm bg-blue-900 hover:bg-blue-900" onClick={() => setShowForm(false)}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
