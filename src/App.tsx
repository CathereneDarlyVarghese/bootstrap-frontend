import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import ScanInventory from "components/ScanInventory";
import { Amplify } from "aws-amplify";
import awsConfig from "aws-exports";
import NavBar from "components/NavBar";
import { ToastContainer } from "react-toastify";

import ListsLayout from "components/LandingPage/ListsLayout";
import LoginPage from "components/LoginPage/LoginPage";
import WorkOrdersPage from "components/WorkOrdersPage/WorkOrdersPage";
import StatusChecksPage from "components/StatusChecksPage/StatusChecksPage";
import DocumentsPage from "components/DocumentsPage/DocumentsPage";

import AdminPage from "components/AdminPage/AdminPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
Amplify.configure(awsConfig);

function AppContent() {
  return (
    <div>
      <NavBar></NavBar>

      <div className="h-screen" style={{ overflow: "scroll" }}>
        <Routes>
          <Route path="/scan" element={<ScanInventory />} />
          <Route path="/home" element={<ListsLayout />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/document/location" element={<DocumentsPage />} />
          <Route path="/status-checks" element={<StatusChecksPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;
