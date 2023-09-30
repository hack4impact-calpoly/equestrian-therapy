import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import "@fontsource/roboto";
import UserContext from "../userContext";

const CheckBox = styled.div`
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1b4c5a;
  width: 43px;
  height: 43px;
  cursor: pointer;
`;
const Check = styled.div`
  border-radius: 4px;
  border: solid 0.5px #c4c4c4;
  background-color: #1b4c5a;
  height: 21px;
  width: 21px;
`;

const NotCheck = styled.div`
  border-radius: 4px;
  background-color: white;
  height: 21px;
  width: 21px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 10px;
`;

const ViewingText = styled.p`
  font-size: 20px;
  font-family: "Roboto";
  font-weight: 700;
  // padding-bottom: 10px;
`;

const ViewingDescription = styled.p`
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 700;
  padding-left: 20px;
`;
type ToggleProps = {
  setToggleProp: (val: string) => void;
};

export default function CalendarToggle({ setToggleProp }: ToggleProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [showRiders, setShowRiders] = useState(false);
  const [showBoth, setShowBoth] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);

  // Password toggle handler
  const toggleVolunteer = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setShowVolunteers(!showVolunteers);
    setShowRiders(false);
    setShowBoth(false);
  };
  const toggleRider = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setShowRiders(!showRiders);
    setShowVolunteers(false);
    setShowBoth(false);
  };
  const toggleBoth = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setShowBoth(!showBoth);
    setShowRiders(false);
    setShowVolunteers(false);
  };
  const toggleNonAdminView = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setShowAvailability(!showAvailability);
  };
  useEffect(() => {
    if (showBoth && userType === "Admin") {
      setToggleProp("Both");
    } else if (showAvailability && userType !== "Admin") {
      setToggleProp("availability");
    } else if (!showAvailability && userType !== "Admin") {
      setToggleProp("slots");
    } else if (showRiders) {
      setToggleProp("Riders");
    } else if (showVolunteers) {
      setToggleProp("Volunteers");
    } else {
      setToggleProp("none");
    }
  }, [showBoth, showRiders, showVolunteers, showAvailability]);

  return (
    <div>
      <ViewingText>Viewing:</ViewingText>
      {userType === "Admin" ? (
        <div>
          <Row>
            <CheckBox onClick={toggleBoth}>
              {showBoth ? <Check /> : <NotCheck />}
            </CheckBox>
            <ViewingDescription>Both</ViewingDescription>
          </Row>
          <Row>
            <CheckBox onClick={toggleVolunteer}>
              {showVolunteers ? <Check /> : <NotCheck />}
            </CheckBox>
            <ViewingDescription>Volunteer only</ViewingDescription>
          </Row>
          <Row>
            <CheckBox onClick={toggleRider}>
              {showRiders ? <Check /> : <NotCheck />}
            </CheckBox>
            <ViewingDescription>Rider only</ViewingDescription>
          </Row>
        </div>
      ) : (
        <div>
          <Row>
            <CheckBox onClick={toggleNonAdminView}>
              {showAvailability ? <Check /> : <NotCheck />}
            </CheckBox>
            <ViewingDescription>Availability</ViewingDescription>
          </Row>
          <Row>
            <CheckBox onClick={toggleNonAdminView}>
              {!showAvailability ? <Check /> : <NotCheck />}
            </CheckBox>
            <ViewingDescription>My Slots</ViewingDescription>
          </Row>
        </div>
      )}
    </div>
  );
}
