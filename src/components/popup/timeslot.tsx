import React, { useState } from "react";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import { Timeslot as TimeslotModel } from "../../models";
import Checked from "../../images/Checked.png";
import Unchecked from "../../images/Unchecked.png";
import On from "../../images/OnSlider.png";
import Off from "../../images/OffSlider.png";

const ButtonToggle = styled.button`
  cursor: pointer;
  outline: none;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0px;
`;

const CheckedImg = styled.img`
  width: 70px;
  margin: 0px;
  align-self: left;
`;

const UnCheckedImg = styled.img`
  width: 70px;
  margin: 0px;
  align-self: left;
`;

const SliderImg = styled.img`
  width: 80px;
  margin: 0px;
  align-self: left;
  padding-right: 20px;
`;

const Slot = styled.div`
  align-items: center;
  justify-content: center;
  border: 1px solid #c4c4c4;
  display: flex;
  flex-direction: row;
  padding: 3%;
  align-items: left;
  block-size: fit-content;
`;

const TimeslotText = styled.p`
  padding-left: 50px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
`;

interface TimeslotProps {
  userType: "volunteer" | "rider" | "admin";
  startTime: Date;
  endTime: Date;
}

// const getTimeslots = async () => {
//   const timeslotInfo = await DataStore.query(TimeslotModel);

//   timeslotInfo
//   .filter((ts) => {
//     if (!ts) {
//       return false; // filter out null or undefined timeslots
//     }
//     if (
//       ts.id === null ||
//       ts.id === undefined ||
//       ts.id === "null" ||
//       ts.id === "undefined" ||
//       ts.startTime === null ||
//       ts.startTime === undefined ||
//       ts.startTime === "null" ||
//       ts.startTime === "undefined" ||
//       ts.endTime === null ||
//       ts.endTime === undefined ||
//       ts.endTime === "null" ||
//       ts.endTime === "undefined"
//     ) {
//       return false; // filter out timeslots with null or undefined properties
//     }
//     return true;
//   })
//   .sort((a, b) => {
//     const aStartTime = a.startTime ? new Date(a.startTime).getTime() : 0;
//     const bStartTime = b.startTime ? new Date(b.startTime).getTime() : 0;
//     return aStartTime - bStartTime;
//   })
//   return timeslotInfo;
// };

export default function Timeslot({
  userType,
  startTime,
  endTime,
}: TimeslotProps) {
  const [isChecked, setIsChecked] = useState(false);
  const dates = [];

  const toggleChecked = (timeslotID: string) => {
    setIsChecked(!isChecked);
    dates.push(timeslotID);
  };
  const formatTime = (time: string) => {
    const dateTime = new Date(time);
    dateTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getTimeslots = async () => {
    const timeslotInfo = await DataStore.query(TimeslotModel);

    const filteredTimeslots = timeslotInfo.filter((ts) => {
      if (!ts) {
        return false; // filter out null or undefined timeslots
      }
      if (
        ts.id === null ||
        ts.id === undefined ||
        ts.id === "null" ||
        ts.id === "undefined" ||
        ts.startTime === null ||
        ts.startTime === undefined ||
        ts.startTime === "null" ||
        ts.startTime === "undefined" ||
        ts.endTime === null ||
        ts.endTime === undefined ||
        ts.endTime === "null" ||
        ts.endTime === "undefined"
      ) {
        return false; // filter out timeslots with null or undefined properties
      }
      return true;
    });

    const sortedTimeslots = filteredTimeslots.sort((a, b) => {
      const aStartTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bStartTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return aStartTime - bStartTime;
    });

    const timeslotElements = sortedTimeslots.map((timeslot) => {
      const { id, startTime, endTime } = timeslot;
      return (
        <Slot key={id}>
          <TimeslotText>
            {startTime && endTime
              ? `${formatTime(startTime)} to ${formatTime(endTime)}`
              : ""}
          </TimeslotText>
          {userType === "volunteer" ? (
            <ButtonToggle onClick={() => toggleChecked(id)}>
              {isChecked ? (
                <CheckedImg src={Checked} alt="Checked Img" />
              ) : (
                <UnCheckedImg src={Unchecked} alt="Unchecked Img" />
              )}
            </ButtonToggle>
          ) : (
            <ButtonToggle onClick={() => toggleChecked(id)}>
              {isChecked ? (
                <SliderImg src={On} alt="On Img" />
              ) : (
                <SliderImg src={Off} alt="Off Img" />
              )}
            </ButtonToggle>
          )}
        </Slot>
      );
    });

    return timeslotElements;
  };

  return { getTimeslots };
}
