import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
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

const AdminPage = () => {
  const [token, setToken] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
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
      <h1>Admin Page</h1>
      <select
        value={selectedAssetType}
        onChange={(e) => setSelectedAssetType(e.target.value)}
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

      {jsonForm && <Form schema={jsonForm} />}
    </div>
  );
};

export default AdminPage;
