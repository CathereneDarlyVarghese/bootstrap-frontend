import React, { useState } from 'react';

import './MyStyle.css';
import AddAssetType from './AssetType';
import Locations from './Locations';
import Sections from './Section';
import Placements from './Placement';
import AddDocumentType from './DocumentType';
import Organizations from './Organization';
import InviteUser from './InviteUser';
import FormBuilder from 'components/StatusChecksPage/FormBuilder';
const AdminPage = () => {
  // State declarations
  const [toggleContent, setToggleContent] = useState(1);
  const [openSidebar, setOpenSidebar] = useState(true);

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
          {/* <label onClick={() => setOpenSidebar(true)} htmlFor="my-drawer" className="btn
          bg-blue-900 hover:bg-blue-900 drawer-button">Open drawer</label> */}
          <button
            className="m-2 btn btn-sm bg-blue-900 hover:bg-blue-900"
            onClick={() => setOpenSidebar(true)}
          >
            Menu
          </button>
          <div>
            {toggleContent === 1 && <AddAssetType />}
            {toggleContent === 2 && <AddDocumentType />}
            {toggleContent === 3 && <Locations />}
            {toggleContent === 4 && <Sections />}
            {toggleContent === 5 && <Placements />}
            {toggleContent === 6 && <Organizations />}
            {toggleContent === 7 && <InviteUser />}
            {toggleContent === 8 && <FormBuilder />}
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
                setToggleContent(2);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Add Document Types
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
            <li
              className=""
              onClick={() => {
                setOpenSidebar(false);
                setToggleContent(6);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Organizations
              </button>
            </li>
            <li
              className=""
              onClick={() => {
                setOpenSidebar(false);
                setToggleContent(7);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Invite Users
              </button>
            </li>
            <li
              className=""
              onClick={() => {
                setOpenSidebar(false);
                setToggleContent(8);
              }}
            >
              <button className="focus:bg-blue-900 focus:text-white">
                Form Builder
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
