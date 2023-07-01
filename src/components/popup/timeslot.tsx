import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Checked from "../../images/Checked.png";
import Unchecked from "../../images/Unchecked.png";
import On from "../../images/OnSlider.png";
import Off from "../../images/OffSlider.png";
import UserContext from "../../userContext";

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

const Slot = styled.div<{ border: string }>`
  align-items: center;
  justify-content: center;
  border: ${({ border }) => border};
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
  startTime: Date;
  endTime: Date;
  tsId: string;
  checked: boolean;
  border: string;
  checkedLst: string[];
  uncheckedLst: string[];
  setCheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setUncheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
}

// export const checkedLst: string[] = [];
// export const uncheckedLst: string[] = [];

export default function Timeslot({
  startTime,
  endTime,
  tsId,
  checked,
  border,
  checkedLst,
  uncheckedLst,
  setCheckedLst,
  setUncheckedLst,
}: TimeslotProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  // console.log("The timeslot is: ", startTime, "THE BORDER IS: ", border);

  const toggleChecked = () => {
    if (isChecked) {
      setUncheckedLst(uncheckedLst.concat(tsId));
      setCheckedLst(uncheckedLst.filter((id) => id !== tsId));
      setIsChecked(!isChecked);
      // console.log("checked");
    } else {
      setCheckedLst(checkedLst.concat(tsId));
      setUncheckedLst(uncheckedLst.filter((id) => id !== tsId));
      setIsChecked(!isChecked);
      // console.log("unchecked");
    }
  };
  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  // useEffect(() => {

  // }, [isChecked]);

  // useEffect(() => {
  //   console.log("checked list: ", checkedLst);
  // }, [checkedLst]);

  // useEffect(() => {
  //   console.log("unchecked list: ", uncheckedLst);
  // }, [uncheckedLst]);
  return (
    <Slot border={border}>
      <TimeslotText>
        {`${formatTime(startTime)} to ${formatTime(endTime)}`}
      </TimeslotText>
      {userType === "Volunteer" ? (
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
