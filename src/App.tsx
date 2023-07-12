import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
// import AddInventory from "components/AddInventory";
import ScanInventory from "components/ScanInventory";
import SignInWithGoogleTest from "components/GoogleSignIn/SignInWithGoogle";
//import AddLocations from 'components/AddLocations';
import { Amplify, Auth, Hub } from "aws-amplify";
import { Formio } from "@formio/react";
import FormioContrib from "@formio/contrib";
import awsConfig from "aws-exports";
import NavBar from "components/NavBar";
import { ToastContainer } from "react-toastify";
import Pusher from "pusher-js";
import ListsLayout from "components/LandingPage/ListsLayout";
import LoginPage from "components/LoginPage/LoginPage";
import { RedirectFunction } from "react-router-dom";
import WorkOrdersPage from "components/WorkOrdersPage/WorkOrdersPage";
import StatusChecksPage from "components/StatusChecksPage/StatusChecksPage";
import DocumentsPage from "components/DocumentsPage/DocumentsPage";
import AssetDocumentsPage from "components/DocumentsPage/AssetDocumentsPage";
import AssetStatusChecksPage from "components/StatusChecksPage/AssetStatusChecksPage";
import AdminPage from "components/AdminPage/AdminPage";
import Builder from "components/AdminPage/Builder";

Amplify.configure(awsConfig);
Formio.use(FormioContrib);

function AppContent() {
  return (
    <div>
      <NavBar></NavBar>

      <div className="h-screen" style={{ overflow: "scroll" }}>
        <Routes>
          <Route
            path="/scan"
            element={
              <ScanInventory
                onScanSuccess={(decodedText, result) => {
                  // Redirect to the decodedText if it's a URL
                  if (decodedText.startsWith("http")) {
                    window.location.href = decodedText;
                  } else {
                    console.log(`Decoded text is not a URL: ${decodedText}`);
                  }
                }}
                onScanError={(errorMessage) => {
                  // You can leave this function empty if you don't want to do anything on error
                }}
              />
            }
          />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<ListsLayout />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/document/location" element={<DocumentsPage />} />
          {/* <Route path="/document/asset" element={<AssetDocumentsPage />} /> */}
          <Route path="/status-checks" element={<StatusChecksPage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* <Route path="/add-workorder" element={<AddWorkOrder />} /> */}
          {/* <Route path="/asset-status-checks" element={<AssetStatusChecksPage />} /> */}
        </Routes>
      </div>
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
