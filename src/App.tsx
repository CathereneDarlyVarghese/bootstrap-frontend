import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import ListPage from "components/ListPage";
import AddInventory from "components/AddInventory";
import {
  Button,
  DynamicPage,
  DynamicPageTitle,
  Title,
} from "@ui5/webcomponents-react";
import ScanInventory from "components/ScanInventory";
import SignInWithGoogleTest from "components/GoogleSignIn/SignInWithGoogle";
import AddDocuments from "components/AddDocuments";
//import AddLocations from 'components/AddLocations';
import SignInWithGoogle from "components/GoogleSignIn/SignInWithGoogle";
import { Amplify, Auth, Hub } from "aws-amplify";
import DubeButton from "components/widgets/Button";

import awsConfig from "aws-exports";
import Home from "components/AddLocations/Locationlist";
import { useEffect, useState } from "react";
import NavBar from "components/NavBar";
import { ToastContainer } from "react-toastify";

import ListsLayout from "components/LandingPage/ListsLayout";
import LoginPage from "components/LoginPage/LoginPage";
import { RedirectFunction } from "react-router-dom";
import WorkOrderForm from "components/LandingPage/WorkOrderForm1";
import WorkOrdersPage from "components/WorkOrdersPage/WorkOrdersPage";

Amplify.configure(awsConfig);

function AppContent() {
  return (
    <div>
      {/* <DynamicPage
        alwaysShowContentHeader={true}
        showHideHeaderButton={false}
        headerContentPinnable={true}
        headerTitle={<NavBar></NavBar>}
      > */}
      <NavBar></NavBar>

      <div className="h-screen">
        <Routes>
          <Route path="/location" element={<ListPage />} />
          <Route path="/add" element={<AddInventory />} />
          <Route path="/add-documents" element={<AddDocuments />} />
          <Route path="/scan" element={<ScanInventory />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<ListsLayout searchType="Asset" />} />
          <Route
            path="/work-orders"
            element={<WorkOrdersPage searchType="Asset" />}
          />

          {/* <Route path="/add-workorder" element={<AddWorkOrder />} /> */}
        </Routes>
      </div>
      {/* </DynamicPage> */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
