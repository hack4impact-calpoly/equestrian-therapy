import React from "react";
import styled from "styled-components";
import { Box } from "../styledComponents";
import Timeslot from "./timeslot";

const Wrapper = styled.section`
  display: flex;
  align-items: left;
  justify-content: center;
  padding: 4%;
  max-height: 600px;
  overflow-y: scroll;
`;

const Slots = styled(Box)`
  //justify content limits view of timeslots
  /* display: flex; */
  flex-direction: column;
  align-items: center;
  // For 100% screen height
  /* width: max; */
  //width: 70vw; /* For 100% screen width */
  border: none;
  box-shadow: none;
  width: 100%;
  height: 100%;
`;

const timeslots = [
  {
    startTime: new Date(2023, 2, 7, 9, 0),
    endTime: new Date(2023, 2, 7, 10, 30),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 9, 30),
    endTime: new Date(2023, 2, 7, 10, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 10, 0),
    endTime: new Date(2023, 2, 7, 10, 30),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 10, 35),
    endTime: new Date(2023, 2, 7, 11, 5),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 13, 0),
    endTime: new Date(2023, 2, 7, 14, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 14, 0),
    endTime: new Date(2023, 2, 7, 15, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 15, 0),
    endTime: new Date(2023, 2, 7, 16, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 16, 0),
    endTime: new Date(2023, 2, 7, 17, 0),
    checked: false,
  },
];

interface TimeslotsProps {
  userType: "volunteer" | "rider";
}

export default function Timeslots({ userType }: TimeslotsProps) {
  function filterTimeSlots(
    isVolunteers: boolean,
    ts: {
      startTime: Date;
      endTime: Date;
      checked: boolean;
    }
  ) {
    if (isVolunteers) {
      return ts.startTime.getHours() >= 9 && ts.endTime.getHours() <= 17;
    }
    return ts.startTime.getHours() >= 10 && ts.endTime.getHours() <= 14;
  }

  return (
    <Wrapper>
      <Slots>
        {timeslots
          .filter((ts) => filterTimeSlots(userType === "volunteer", ts))
          .map((timeslot) => (
            <Timeslot
              userType={userType}
              startTime={timeslot.startTime}
              endTime={timeslot.endTime}
            />
          ))}
      </Slots>
    </Wrapper>
  );
}
