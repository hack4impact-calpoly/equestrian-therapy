import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Checked from "../../images/checked.png";
import Unchecked from "../../images/unchecked.png";
import On from "../../images/onSlider.png";
import Off from "../../images/offSlider.png";
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
  bookedToday: number;
  checkedLst: string[];
  uncheckedLst: string[];
  oneSelected: string;
  previousTimeslots: string[];
  setBookedToday: React.Dispatch<React.SetStateAction<number>>;
  setCheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setUncheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setOneSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function Timeslot({
  startTime,
  endTime,
  tsId,
  checked,
  border,
  bookedToday,
  checkedLst,
  uncheckedLst,
  oneSelected,
  previousTimeslots,
  setBookedToday,
  setCheckedLst,
  setUncheckedLst,
  setOneSelected,
}: TimeslotProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const toggleChecked = () => {
    if (isChecked) {
      if (
        oneSelected !== "" &&
        previousTimeslots &&
        previousTimeslots.includes(tsId)
      ) {
        return;
      }
      setCheckedLst(uncheckedLst.filter((id) => id !== tsId));
      setIsChecked(!isChecked);
      setBookedToday(bookedToday - 1);
      if (userType === "Admin") {
        setUncheckedLst(uncheckedLst.concat(tsId));
      }
      // if it was one of the previous selected timeslots
      if (previousTimeslots && previousTimeslots.includes(tsId)) {
        setOneSelected(tsId); // set oneSelected to the current timeslot id so we know something has been unselected
        setUncheckedLst(uncheckedLst.concat(tsId)); // Only add it to the unchecked list if it was previously booked
      }
    } else {
      if (bookedToday >= 1 && userType === "Rider") {
        return;
      }
      // only add something to the checkedlist if it wasn't already booked, prevents double booking on same user
      if (previousTimeslots && !previousTimeslots.includes(tsId)) {
        setCheckedLst(checkedLst.concat(tsId));
      }
      setUncheckedLst(uncheckedLst.filter((id) => id !== tsId));
      setIsChecked(!isChecked);
      setBookedToday(bookedToday + 1);
      // reset the oneSelected if they're riders (can only have one booked anyways) or if its the one that was just unchecked
      if (userType === "Rider" || tsId === oneSelected) {
        setOneSelected("");
      }
    }
  };

  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <Slot border={border}>
      <TimeslotText>
        {`${formatTime(startTime)} to ${formatTime(endTime)}`}
      </TimeslotText>
      {userType !== "Admin" ? (
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
