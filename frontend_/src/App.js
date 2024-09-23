import React from "react";
import AppRoutes from "./routes";
import NavBar from "./components/NavBar";
import AppFooter from "./components/AppFooter";
import './components/app.css'


function App() {
  return (
    <div className="App">
      <NavBar/>
     <div> <AppRoutes /></div>
      <AppFooter/>
    </div>
  );
}

export default App;
