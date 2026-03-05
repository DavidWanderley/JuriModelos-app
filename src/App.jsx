import React from "react";
import AppRoutes from "./routers";
import Toast, { useToast } from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";
import LogViewer from "./components/LogViewer";

function App() {
  const { toasts } = useToast();

  return (
    <ErrorBoundary>
      <div className="App">
        <Toast toasts={toasts} />
        <LogViewer />
        <AppRoutes />
      </div>
    </ErrorBoundary>
  );
}

export default App;
