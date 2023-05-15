import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
  userType: string;
  startTime: string;
  endTime: string;
  tsID: string;
}

export const checkedLst: string[] = [];
export const uncheckedLst: string[] = [];

export default function Timeslot({
  userType,
  startTime,
  endTime,
  tsID,
}: TimeslotProps) {
  const [isChecked, setIsChecked] = useState(false);
  const toggleChecked = () => {
    setIsChecked(!isChecked);
  };
  const formatTime = (time: string) => {
    const dateTime = new Date(time);
    return dateTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    if (isChecked) {
      checkedLst.push(tsID);
      uncheckedLst.splice(uncheckedLst.indexOf(tsID), 1);
    } else {
      uncheckedLst.push(tsID);
      checkedLst.splice(checkedLst.indexOf(tsID), 1);
    }
  }, [isChecked, tsID]);

  return (
    <Slot>
      {/* <TimeBox> */}
      <TimeslotText>
        {`${formatTime(startTime)} to ${formatTime(endTime)}`}
      </TimeslotText>
      {/* </TimeBox> */}
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
            <SliderImg src={On} alt="On Img" />
          ) : (
            <SliderImg src={Off} alt="Off Img" />
          )}
        </ButtonToggle>
      )}
    </Slot>
  );
}
