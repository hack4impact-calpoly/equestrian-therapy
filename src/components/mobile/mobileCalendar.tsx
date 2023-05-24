/* eslint-disable no-param-reassign */
import React, { useState } from "react";
import styled from "styled-components";
import MobileTimeslots from "./mobileTimeslots";
import MobileWeeklyView from "./mobileWeeklyView";
import { Dropdown, Option } from "./dropdown";

const CurrentDate = styled.text`
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

type UserType = {
  user: "volunteer" | "rider" | "admin";
  bookings: number;
  day: string;
  setDayProp: (val: string) => void;
  month: string;
  setMonthProp: (val: string) => void;
  weekday: string;
  setWeekdayProp: (val: string) => void;
};

export default function CalendarMobile({
  user,
  day,
  setDayProp,
  month,
  setMonthProp,
  weekday,
  setWeekdayProp,
}: UserType) {
  const currentTimeString: string[] = [];
  currentTimeString.push(weekday);
  currentTimeString.push(", ");
  currentTimeString.push(month);
  currentTimeString.push(" ");
  currentTimeString.push(day);

  const [optionValue, setOptionValue] = useState("");

  const handleSelect = (e: { target: { value: string } }) => {
    // console.log(e.target.value);
    // console.log(optionValue);
    setOptionValue(e.target.value);
  };

  return (
    <div>
      <MobileWeeklyView
        startDate={new Date()}
        setDayProp={setDayProp}
        setMonthProp={setMonthProp}
        setWeekdayProp={setWeekdayProp}
      />
      <CurrentDate>{currentTimeString}</CurrentDate>
      <Dropdown onChange={handleSelect}>
        <Option selected value={user === "admin" ? "Both" : "Availability"} />
        <Option
          value={user !== "admin" ? "My Slots" : "Riders"}
          selected={undefined}
        />

        {user === "admin" ? (
          <Option value="Volunteers" selected={undefined} />
        ) : (
          <div>0</div>
        )}
      </Dropdown>
      <MobileTimeslots userType={user} />
    </div>
  );
}
