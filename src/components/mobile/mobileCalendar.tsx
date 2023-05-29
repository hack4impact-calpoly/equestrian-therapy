/* eslint-disable no-param-reassign */
import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import styled from "styled-components";
import UserContext from "../../userContext";
import MobileTimeslots from "./mobileTimeslots";
import MobileWeeklyView from "./mobileWeeklyView";
import { Dropdown, Option } from "./dropdown";
import signoutarrow from "../../images/SignOutArrow.png";

const CurrentDate = styled.p`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  margin-left: 12%;
  color: #1b4c5a;
  display: flex;
  margin-top: 20%;
`;

const StyledButton = styled(Link)`
  display: inline-block;
  position: absolute;
  right: 0;
  width: 80px;
  height: 80px;
  transform: scale(0.5);
`;

const StyledImage = styled.img`
  width: 100%;
`;

// props used in mobileweeklyview as well
type UserType = {
  bookingsFake: number;
  day: string;
  setDayProp: (val: string) => void;
  month: string;
  setMonthProp: (val: string) => void;
  weekday: string;
  setWeekdayProp: (val: string) => void;
};

export default function CalendarMobile({
  bookingsFake,
  day,
  setDayProp,
  month,
  setMonthProp,
  weekday,
  setWeekdayProp,
}: UserType) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;
  // these values are hardcoded for conditional rendering of showing different slots
  // eslint-disable-next-line no-param-reassign
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bookingsFake = 1;

  // this is to create the current selected date string
  const currentTimeString: string[] = [];
  currentTimeString.push(weekday);
  currentTimeString.push(", ");
  currentTimeString.push(month);
  currentTimeString.push(" ");
  currentTimeString.push(day);

  // this is for the toggle dropdown
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [optionValue, setOptionValue] = useState("");
  const handleSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setOptionValue(e.target.value);
  };

  return (
    <div>
      <StyledButton to="/logout">
        <StyledImage src={signoutarrow} alt="Sign Out" />
      </StyledButton>

      {/* renders the calendar  */}
      <MobileWeeklyView
        startDate={new Date()}
        setDayProp={setDayProp}
        setMonthProp={setMonthProp}
        setWeekdayProp={setWeekdayProp}
      />
      {/* creates the current selected date */}
      <CurrentDate>{currentTimeString}</CurrentDate>
      {/* this is for the toggle dropdown with different options on different user types */}
      <Dropdown onChange={handleSelect}>
        <Option
          selected
          value={userType === "Admin" ? "Both" : "Availability"}
        />
        <Option
          value={userType !== "Admin" ? "My Slots" : "Riders"}
          selected={undefined}
        />

        {userType === "Admin" ? (
          <Option value="Volunteers" selected={undefined} />
        ) : (
          <div>0</div>
        )}
      </Dropdown>
      {/* the timeslots will change depending on the usertype */}
      <MobileTimeslots />
    </div>
  );
}
