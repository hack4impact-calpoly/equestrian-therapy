import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import Success from "./components/success";
import ResetPassword from "./components/resetPassword";
import CreateAccount from "./components/createAccount";
import EnterCode from "./components/enterCode";
import Login from "./components/login";
import ForgotPassword from "./components/forgotPassword";
import WeeklyView from "./components/weeklyView";
import Calendar from "./components/calendar";

Amplify.configure(awsconfig);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /, /login, /create-account, /forgot-password, /enter-code, /reset-password, /success */}
        <Route path="/" element={<WeeklyView startDate={new Date()} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/enter-code" element={<EnterCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
