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

const getTimeslots = async () => {
  const timeslotInfo = await DataStore.query(TimeslotModel);
  const tsList = (await Promise.all(timeslotInfo.map(async (ts) => {
    const tsInfo = await DataStore.query(TimeslotModel, ts);
    if (tsInfo?.id && tsInfo?.startTime && tsInfo?.endTime) {
      return {
        id: tsInfo.id,
        startTime: tsInfo.startTime,
        endTime: tsInfo.endTime,
        unavailableDates: tsInfo.unavailableDates,
      };
    }
    return null;
  })))
    .filter(Boolean)
    .sort((a, b) => new Date(a?.startTime ?? 0).getTime() - new Date(b?.startTime ?? 0).getTime())


};

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
  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <Slot>
      {/* <TimeBox> */}
      <TimeslotText>
        {`${formatTime(startTime)} to ${formatTime(endTime)}`}
      </TimeslotText>
      {/* </TimeBox> */}
      {userType === "volunteer" ? (
        <ButtonToggle onClick={() => toggleChecked(timeslotID)}>
          {isChecked ? (
            <CheckedImg src={Checked} alt="Checked Img" />
          ) : (
            <UnCheckedImg src={Unchecked} alt="Unchecked Img" />
          )}
        </ButtonToggle>
      ) : (
        <ButtonToggle onClick={() => toggleChecked(timeslotID)}>
          {isChecked ? (
            <SliderImg src={On} alt="On Img" />
          ) : (
            <SliderImg src={Off} alt="Off Img" />
          )}
        </ButtonToggle>
      )}
    </Slot>
  );
}
