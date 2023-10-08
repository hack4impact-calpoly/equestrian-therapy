/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Amplify, DataStore } from "aws-amplify";
import { LazyTimeslot, Timeslot, User as UserModel } from "./models";
import awsconfig from "./aws-exports";
import Calendar from "./components/calendar";
import CalendarMobile from "./components/mobile/mobileCalendar";
import UserContext from "./userContext";
import ForgotPassword from "./components/authentication/forgotPassword";
import ResetPassword from "./components/authentication/resetPassword";
import Login from "./components/authentication/login";
import CreateAccount from "./components/authentication/createAccount";
import EnterCode from "./components/authentication/enterCode";
import Success from "./components/authentication/success";
import MobileLogout from "./components/mobile/mobileLogout";

Amplify.configure(awsconfig);

function App() {
  const [email, setEmailProp] = useState<string>();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [timeslots, setTimeslots] = useState<LazyTimeslot[]>([]);

  // setting up context
  const [currentUser, setUser] = useState({} as UserModel[]);
  const userContextFields = useMemo(
    () => ({ currentUser, setUser }),
    [currentUser]
  );

  /**
   * This useEffect is run when the app component opens and will check the screen size to
   * determine whether it's a mobile device or not then pull the timeslot data to pass throughout
   * the app.
   */
  useEffect(() => {
    // If the screen size is less than 501 pixels then set it to mobile view
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 500);
    };

    // Pull the timeslots from the database and store them in the timeslots useState variable
    const pullData = async () => {
      const ts = await DataStore.query(Timeslot);
      setTimeslots(ts);
    };

    // Add the eventListened to the window so it will check for the mobile switch on resize
    window.addEventListener("resize", handleResize);
    handleResize();
    pullData();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <UserContext.Provider value={userContextFields}>
      <BrowserRouter>
        <Routes>
          {/* Starting Protected Routes */}
          {/* If not logged in when trying to access below route, redirect to login */}
          {currentUser.length > 0 ? (
            <Route
              path="/"
              element={
                isMobile ? (
                  <CalendarMobile
                    timeslots={timeslots}
                    setTimeslots={setTimeslots}
                  />
                ) : (
                  <Calendar timeslots={timeslots} setTimeslots={setTimeslots} />
                )
              }
            />
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          {currentUser.length > 0 ? (
            <Route path="/logout" element={<MobileLogout />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )}

          {/* Starting Public Routes */}
          {/* Can access regardless of login status */}

          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/enter-code" element={<EnterCode />} />
          <Route path="/success/:id" element={<Success />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword setEmailProp={setEmailProp} />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword email={email!} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
