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
  const [toggleContent, setToggleContent] = useState(1);
  const [qrOptions, setQrOptions] = useState(0);
  const [assetType, setAssetType] = useState<string>("");
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [openSidebar, setOpenSidebar] = useState(true);

  // Handler for showing modal
  const handleShow = () => setShowModal(true);

  // Effect to fetch all asset types on mount
  // useEffect(() => {
  //   const fetchToken = async () => {
  //       const assetTypes1 = await getAllAssetTypes(authTokenObj.authToken);
  //       setAssetTypes(assetTypes1);
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
  //           const newForm = await createAssetCheckForm(authTokenObj.authToken, {
  //             form_json: {},
  //             asset_type_id: selectedAssetType,
  //           });
  //           setJsonForm(newForm.form_json); // Adjust according to your returned data structure
  //           handleShow();
  //       }
  //     }
  //   };

  //   if (selectedAssetType) {
  //     fetchForm();
  //   }
  // }, [selectedAssetType, authTokenObj.authToken]);

  return (
    <div>
      <div className="drawer">
        <input
          id="my-drawer"
          type="checkbox"
          checked={openSidebar}
          className="drawer-toggle"
        />
        <div className="drawer-content">
          {/* Page content here */}
          {/* <label onClick={() => setOpenSidebar(true)} htmlFor="my-drawer" className="btn bg-blue-900 hover:bg-blue-900 drawer-button">Open drawer</label> */}
          <button
            className="m-2 btn btn-sm bg-blue-900 hover:bg-blue-900"
            onClick={() => setOpenSidebar(true)}
          >
            Menu
          </button>
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
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li
              className=""
              onClick={() => {
                setOpenSidebar(false);
                setToggleContent(1);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Add Asset Types
              </button>
            </li>
            <li
              className=""
              onClick={() => {
                setOpenSidebar(false);
                setToggleContent(3);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Locations
              </button>
            </li>
            <li
              className=""
              onClick={() => {
                setOpenSidebar(false);
                setToggleContent(4);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Sections
              </button>
            </li>
            <li
              className=""
              onClick={() => {
                setOpenSidebar(false);
                setToggleContent(5);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Placements
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
