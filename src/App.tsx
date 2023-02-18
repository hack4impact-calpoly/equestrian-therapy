import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import Temp from "./components/Temp";
import Success from "./success";
import ResetPassword from "./resetPassword";
import CreateAccount from "./createAccount";
import EnterCode from "./enterCode";
import AddAvailability from "./addAvailability";

Amplify.configure(awsconfig);
// import Home from "./home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /, /login, /create-account, /forgot-password, /enter-code, /reset-password, /success */}
        <Route path="/" element={<Temp />} />
        <Route path="/login" element={<Temp />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<Temp />} />
        <Route path="/enter-code" element={<EnterCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/add-availability" element={<AddAvailability />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
