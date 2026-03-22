import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Msg1 from "./components/msg1";
import Msg2 from "./components/msg2";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="bg-black text-2xl text-white min-h-screen flex  flex-col gap-5 items-center justify-center">
      <BrowserRouter>
        <Routes>
          {/**<Route path="/" element={<Login />} />**/}
          {/**<Route path="/dashboard" element={<Dashboard />} />**/}
          <Route path="/" element={<Msg1 />} />
          <Route path="/msg2" element={<Msg2 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
