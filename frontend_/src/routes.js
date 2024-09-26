import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Sensor from "./components/Sensor";
import Home from "./components/Home";
import NavBar from "./components/NavBar"; 
import NavControl from "./components/Nav-Control";
import Sensor2 from "./components/Sensor2";
import Sensor3 from "./components/Sensor3";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <>
              
              <NavControl/>
              <AppContent />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sensor1" element={<Sensor />} />
      <Route path="/sensor2" element={<Sensor2 />} />
      <Route path="/sensor3" element={<Sensor3 />} />
    </Routes>
  );
};

export default AppRoutes;
