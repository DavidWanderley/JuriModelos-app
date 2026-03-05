import React from "react";
import AppRoutes from "./routers";
import Toast, { useToast } from "./components/Toast";

function App() {
  const { toasts } = useToast();

  return (
    <div className="App">
      <Toast toasts={toasts} />
      <AppRoutes />
    </div>
  );
}

export default App;
