import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

import ScanInventory from "components/ScanInventory";
import { Amplify, Auth, Hub } from "aws-amplify";
import awsConfig from "aws-exports";
import NavBar from "components/NavBar";
import { ToastContainer } from "react-toastify";

import ListsLayout from "components/LandingPage/ListsLayout";
import LoginPage from "components/LoginPage/LoginPage";
import WorkOrdersPage from "components/WorkOrdersPage/WorkOrdersPage";
import StatusChecksPage from "components/StatusChecksPage/StatusChecksPage";
import DocumentsPage from "components/DocumentsPage/DocumentsPage";

import AdminPage from "components/AdminPage/AdminPage";

Amplify.configure(awsConfig);

function AppContent() {
  return (
    <div>
      <NavBar></NavBar>

      <div className="h-screen" style={{ overflow: "scroll" }}>
        <Routes>
          <Route path="/scan" element={<ScanInventory />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<ListsLayout />} />
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
