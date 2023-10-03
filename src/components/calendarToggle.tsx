import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import "@fontsource/roboto";
import UserContext from "../userContext";

const Check = styled.div`
  border-radius: 4px;
  border: solid 0.5px #c4c4c4;
  background-color: #1b4c5a;
  height: 21px;
  width: 21px;
`;

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

const ViewingDescription = styled.p`
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 700;
  padding-left: 20px;
`;

const ViewingText = styled.p`
  font-size: 20px;
  font-family: "Roboto";
  font-weight: 700;
`;

type ToggleProps = {
  setToggleValue: (val: string) => void;
};

export default function CalendarToggle({ setToggleValue }: ToggleProps) {
  const [showAvailability, setShowAvailability] = useState(true);
  const [showRiders, setShowRiders] = useState(false);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [showBoth, setShowBoth] = useState(true);
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  /**
   * This function is run when the user clicks the Both toggle it will switch the toggleValue
   * to Both if it wasn't previously selected
   */
  const toggleBoth = () => {
    // If the toggleValue is already Both then keep it like that
    if (showBoth) {
      return;
    }
    // Otherwise turn Both on
    setShowBoth(true);
    setShowRiders(false);
    setShowVolunteers(false);
  };

  /**
   * This function is run when the user clicks the Riders toggle it will switch the toggleValue
   * to Riders if it wasn't previously selected, or Both if it was
   */
  const toggleRider = () => {
    // If Riders was already selected then switch to Both
    if (showRiders) {
      setShowRiders(false);
      setShowVolunteers(false);
      setShowBoth(true);
    }
    // Otherwise turn Riders on
    else {
      setShowRiders(true);
      setShowVolunteers(false);
      setShowBoth(false);
    }
  };

  /**
   * This function is run when the user clicks the Volunteers toggle it will switch the toggleValue
   * to Volunteers if it wasn't previously selected, or Both if it was
   */
  const toggleVolunteer = () => {
    // If Volunteers was already selected then switch to Both
    if (showVolunteers) {
      setShowVolunteers(false);
      setShowRiders(false);
      setShowBoth(true);
    }
    // Otherwise turn Volunteers on
    else {
      setShowVolunteers(true);
      setShowRiders(false);
      setShowBoth(false);
    }
  };

  /**
   * This function is run when the user clicks the Volunteers toggle it will switch the toggleValue
   * to Volunteers if it wasn't previously selected, or Both if it was
   */
  const toggleNonAdminView = () => {
    setShowAvailability(!showAvailability);
  };

  /**
   * This useEffect is run whenever one of the toggle buttons is clicked, it will update the overall
   * toggleValue which is used in the logic in the other components of the app.
   */
  useEffect(() => {
    if (showBoth && userType === "Admin") {
      setToggleValue("Both");
    } else if (showAvailability && userType !== "Admin") {
      setToggleValue("availability");
    } else if (!showAvailability && userType !== "Admin") {
      setToggleValue("slots");
    } else if (showRiders) {
      setToggleValue("Riders");
    } else if (showVolunteers) {
      setToggleValue("Volunteers");
    } else {
      setToggleValue("none");
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
