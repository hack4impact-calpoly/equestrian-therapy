import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Amplify, DataStore, Auth } from "aws-amplify";
// import { DataStore } from "@aws-amplify/datastore";
import { LazyTimeslot, Timeslot } from "./models";
import awsconfig from "./aws-exports";
import Success from "./components/authentication/success";
import ResetPassword from "./components/authentication/resetPassword";
import CreateAccount from "./components/authentication/createAccount";
import EnterCode from "./components/authentication/enterCode";
import Login from "./components/authentication/login";
import ForgotPassword from "./components/authentication/forgotPassword";
import Timeslots from "./components/popup/timeslots";
import Calendar from "./components/calendar";
import CalendarMobile from "./components/mobile/mobileCalendar";
import MobileTimeslots from "./components/mobile/mobileTimeslots";
import TimeslotSuccess from "./components/popup/timeslotSuccess";
import TimeSlotConfirmation from "./components/popup/timeslotConfirmation";
import UserContext from "./userContext";
import { User } from "./types";
import { User as UserModel } from "./models";

Amplify.configure(awsconfig);

function App() {
  const [email, setEmailProp] = useState<string>();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // maybe i use this prop to pass into calendar mobile so that
  // mobile weekly view page will change it onclick which in turn
  // will change the current date

  const [day, setDayProp] = useState<string>();
  const [month, setMonthProp] = useState<string>();
  const [weekday, setWeekdayProp] = useState<string>();
  const [timeslots, setTs] = useState<LazyTimeslot[]>([]);
  const [userInfo, setUserInfo] = useState<UserModel | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 500);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // added additional attributes to the calendarmobile component for props

  useEffect(() => {
    const pullData = async () => {
      const ts = await DataStore.query(Timeslot);
      setTs(ts);
      console.log(ts);
    };
    const fetchUserInfo = async () => {
      try {
        setUserId(await Auth.currentUserInfo());
        if (userId !== null) {
          const info = await DataStore.query(UserModel, userId);
          if (info) {
            setUserInfo(info);
          } else {
            console.log("User data not found");
          }
        }
      } catch (error) {
        console.log("Error fetching user info:", error);
      }
    };

    fetchUserInfo();

    pullData();
  }, []);
  // setting up context
  const [currentUser, setUser] = useState({} as User);
  const userContextFields = useMemo(
    () => ({ currentUser, setUser }),
    [currentUser]
  );
  // console statement to test if userName was set in login component
  console.log(`from the context stuff ${currentUser.userName}`);
  return (
    <UserContext.Provider value={userContextFields}>
      <BrowserRouter>
        <Routes>
          {/* /, /login, /create-account, /forgot-password, /enter-code, /reset-password, /success */}
          <Route
            path="/"
            element={
              isMobile ? (
                <CalendarMobile
                  user=""
                  bookings={0}
                  day={day!}
                  setDayProp={setDayProp}
                  month={month!}
                  setMonthProp={setMonthProp}
                  weekday={weekday!}
                  setWeekdayProp={setWeekdayProp}
                />
              ) : (
                <Calendar userType="rider" />
              )
            }
          />
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
          <Route
            path="/timeslots"
            element={
              userInfo && userInfo.userType && (
                <Timeslots
                  userType={userInfo.userType}
                  models={timeslots}
                  date={new Date()}
                />
              )
            }
          />
          <Route
            path="/mobile-timeslots"
            element={<MobileTimeslots userType="rider" />}
          />
          <Route path="/timeslot-success" element={<TimeslotSuccess />} />
          <Route
            path="/timeslot-confirmation"
            element={<TimeSlotConfirmation userType="rider" status="book" />}
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
