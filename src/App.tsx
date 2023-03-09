import React, { useState, useEffect } from "react";
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
import Calendar from "./components/calendar";
import CalendarMobile from "./components/calendarMobile";

Amplify.configure(awsconfig);

function App() {
  const [email, setEmailProp] = useState<string>();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 500);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* /, /login, /create-account, /forgot-password, /enter-code, /reset-password, /success */}
<<<<<<< HEAD
        <Route
          path="/"
          element={isMobile ? <CalendarMobile /> : <Calendar />}
        />
=======
        <Route path="/" element={<Calendar />} />
>>>>>>> 1814f768488a9610e798fc797390737797ca5f45
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/enter-code" element={<EnterCode />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword setEmailProp={setEmailProp} />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword email={email!} />}
        />
        <Route path="/success/:id" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
