import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import AddInventory from "components/AddInventory";
import ScanInventory from "components/ScanInventory";
import SignInWithGoogleTest from "components/GoogleSignIn/SignInWithGoogle";
import AddDocuments from "components/AddDocuments";
//import AddLocations from 'components/AddLocations';
import { Amplify, Auth, Hub } from "aws-amplify";

import awsConfig from "aws-exports";
import NavBar from "components/NavBar";
import { ToastContainer } from "react-toastify";

import ListsLayout from "components/LandingPage/ListsLayout";
import LoginPage from "components/LoginPage/LoginPage";
import { RedirectFunction } from "react-router-dom";
import WorkOrdersPage from "components/WorkOrdersPage/WorkOrdersPage";
import TempDocPage from "components/DocumentsPage/TempDocPage";

Amplify.configure(awsConfig);

function AppContent() {
  return (
    <div>
      <NavBar></NavBar>

      <div className="h-screen">
        <Routes>
          <Route path="/add" element={<AddInventory />} />
          <Route path="/add-documents" element={<AddDocuments />} />
          <Route path="/scan" element={<ScanInventory />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<ListsLayout searchType="Asset" />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/documents" element={<TempDocPage />} />

          {/* <Route path="/add-workorder" element={<AddWorkOrder />} /> */}
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
