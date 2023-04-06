import React, { useState } from "react";
import styled from "styled-components";
import { Box } from "../styledComponents";
import Checked from "../../images/Checked.png";
import Unchecked from "../../images/Unchecked.png";
import On from "../../images/onslider.png";
import Off from "../../images/offslider.png";

const TimeBox = styled(Box)`
  white-space: nowrap;
  text-overflow: clip;
  border: 0;
  box-shadow: none;
  padding: 0;
  width: 100%;
`;

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

const OnSliderImg = styled.img`
  width: 80px;
  margin: 0px;
  align-self: left;
`;

const OffSliderImg = styled.img`
  width: 80px;
  margin: 0px;
  align-self: left;
`;

const Slot = styled(Box)`
  /* font-family: "Rubik", sans-serif;
  align-items: center;
  justify-content: center;
  border: 1px solid #c4c4c4;
  /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
  /* height: 30vh; /* For 10% screen height */
  /* width: 30vw; /* For 10% screen width */
  display: flex;
  flex-direction: row;
  padding: 3%;
  align-items: left;
  /* border: none; */
  width: 80%;
  // width: fit-content;
  block-size: fit-content;
`;

interface TimeslotProps {
  userType: "volunteer" | "rider" | "admin";
  startTime: Date;
  endTime: Date;
}

export default function Timeslot({
  userType,
  startTime,
  endTime,
}: TimeslotProps) {
  const [isChecked, setIsChecked] = useState(false);

  const toggleChecked = () => {
    setIsChecked(!isChecked);
  };
  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <Slot>
      <TimeBox>{`${formatTime(startTime)} to ${formatTime(endTime)}`}</TimeBox>
      {userType === "volunteer" ? (
        <ButtonToggle onClick={toggleChecked}>
          {isChecked ? (
            <CheckedImg src={Checked} alt="Checked Img" />
          ) : (
            <UnCheckedImg src={Unchecked} alt="Unchecked Img" />
          )}
        </ButtonToggle>
      ) : (
        <ButtonToggle onClick={toggleChecked}>
          {isChecked ? (
            <OnSliderImg src={On} alt="On Img" />
          ) : (
            <OffSliderImg src={Off} alt="Off Img" />
          )}
        </ButtonToggle>
      )}
    </Slot>
  );
}
