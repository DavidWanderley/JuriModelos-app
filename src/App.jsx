import React from "react";
import AppRoutes from "./routers";
import Sidebar from "./components/Sidebar"; // Certifique-se de criar estes componentes
import Header from "./components/Header";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
