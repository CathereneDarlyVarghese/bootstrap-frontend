import React, { useState, useEffect } from "react";
import { createAssetType, getAllAssetTypes } from "services/assetTypeServices";
import { Auth } from "aws-amplify";
import {
  createAssetCheckForm,
  getAssetCheckFormById,
} from "services/assetCheckFormServices";
import Form from "react-jsonschema-form";
import { Helmet } from "react-helmet";

import "./MyStyle.css";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import Sidebar from "./Sidebar";
import ShowForms from "./ShowForms";
import AddAssetType from "./AssetType";
import QRCodes from "./QRCodes";
import Locations from "./Locations";
import { AssetLocation } from "types";
import { useQueryClient } from "@tanstack/react-query";
import Sections from "./Section";
import Placements from "./Placement";

const AdminPage = () => {
  // State declarations
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [, setShowModal] = useState(false); // You might want to replace ',' with a state variable if you're using it
  const [toggleContent, setToggleContent] = useState(0);
  const [qrOptions, setQrOptions] = useState(0);
  const [assetType, setAssetType] = useState<string>("");
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [openSidebar, setOpenSidebar] = useState(true);

  // Handler for showing modal
  const handleShow = () => setShowModal(true);

  // Effect to fetch all asset types on mount
  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const assetTypes1 = await getAllAssetTypes(authTokenObj.authToken);
  //       setAssetTypes(assetTypes1);
  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     }
  //   };

  //   fetchToken();
  // }, []);

  // Effect to fetch or create form based on selected asset type
  // useEffect(() => {
  //   const fetchForm = async () => {
  //     try {
  //       const form = await getAssetCheckFormById(
  //         authTokenObj.authToken,
  //         selectedAssetType
  //       );
  //       setJsonForm(form.form_json); // Adjust according to your returned data structure
  //       handleShow();
  //     } catch (error) {
  //       if (error.response?.status === 404) {
  //         try {
  //           const newForm = await createAssetCheckForm(authTokenObj.authToken, {
  //             form_json: {},
  //             asset_type_id: selectedAssetType,
  //           });
  //           setJsonForm(newForm.form_json); // Adjust according to your returned data structure
  //           handleShow();
  //         } catch (error) {
  //           console.error("Failed to create a new form:", error);
  //         }
  //       } else {
  //         console.error("Failed to fetch form:", error);
  //       }
  //     }
  //   };

  //   if (selectedAssetType) {
  //     fetchForm();
  //   }
  // }, [selectedAssetType, authTokenObj.authToken]);

  return (
    <div className="admin-page flex flex-row">

      <div className={`${openSidebar ? "" : "md:hidden"} md:absolute`}>
        <Sidebar
          // setToggleContent={setToggleContent}
          setToggleContent={(value) => {
            setToggleContent(value)
            setOpenSidebar(false)
          }}
          setQrOptions={setQrOptions}
        />
      </div>

      <div className="2xl:w-4/5 md:w-full flex flex-col m-0 p-0">
        {/* {toggleContent === 0 && (
          <ShowForms
            assetTypes={assetTypes}
            selectedAssetType={selectedAssetType}
            setSelectedAssetType={setSelectedAssetType}
            jsonForm={jsonForm}
          />
        )} */}
        <div className="ml-auto 2xl:hidden md:block">
          <button className="btn btn-xs bg-blue-900 hover:bg-blue-900 m-2"
            onClick={() => setOpenSidebar(!openSidebar)}>Menu</button>
        </div>
        <div>
          {toggleContent === 1 && (
            <AddAssetType assetType={assetType} setAssetType={setAssetType} />
          )}
          {/* {toggleContent === 2 && <QRCodes />} */}
          {toggleContent === 3 && <Locations />}
          {toggleContent === 4 && <Sections />}
          {toggleContent === 5 && <Placements />}
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
