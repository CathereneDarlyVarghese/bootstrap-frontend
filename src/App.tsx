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
import WorkOrderForm from "components/LandingPage/WorkOrderForm";

Amplify.configure(awsConfig);

function AppContent() {
  return (
    <>
      <DynamicPage
        alwaysShowContentHeader={true}
        showHideHeaderButton={false}
        headerContentPinnable={true}
        headerTitle={
          // <DynamicPageTitle
          //   actions={
          //     <>
          //       {/* <Button design="Emphasized">Login</Button> */}
          //       <SignInWithGoogle user={user} />
          //       <DubeButton
          //         onClick={() => navigate('/scan')}
          //         title="Scan"
          //         primary={true}
          //       />
          //       {user && (
          //         <div className="flex row">
          //           <div className="avatar">
          //             <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          //               <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          //             </div>
          //           </div>
          //           <div className="flex col">
          //             <p className="mr-4">{user.attributes.name}</p>
          //             <p className="mr-4">{user.attributes.email}</p>
          //           </div>
          //         </div>
          //       )}
          //     </>
          //   }
          //   header={
          //     <Title>
          //       <Link to="/">Dube</Link>
          //     </Title>
          //   }
          // />
          <NavBar></NavBar>
        }
      >
        <div className="h-screen">
          <Routes>
            <Route path="/location" element={<ListPage />} />
            <Route path="/add" element={<AddInventory />} />
            <Route path="/add-documents" element={<AddDocuments />} />
            <Route path="/scan" element={<ScanInventory />} />
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/home" element={<ListsLayout searchType="Asset" />} />
            {/* <Route path="/add-workorder" element={<WorkOrderForm formOpen={true} setFormOpen={true} notific={true} />} /> */}
          </Routes>
        </div>
      </DynamicPage>
    </>
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
