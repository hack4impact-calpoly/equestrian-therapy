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

const UnCheckedImg = styled.img`
  width: 70px;
  margin: 0px;
  align-self: left;
`;

type TimeslotProps = {
  timeslotId: string;
  startTime: Date;
  endTime: Date;
  border: string;
  checked: boolean;
  previousTimeslots: string[];
  riderDisabled: boolean;
  bookedToday: number;
  checkedLst: string[];
  uncheckedLst: string[];
  oneUnselected: string;
  riderDisabledLst: string[];
  setBookedToday: React.Dispatch<React.SetStateAction<number>>;
  setCheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setUncheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setOneUnselected: React.Dispatch<React.SetStateAction<string>>;
  setRiderDisabledLst: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Timeslot({
  timeslotId,
  startTime,
  endTime,
  border,
  checked,
  previousTimeslots,
  riderDisabled,
  bookedToday,
  checkedLst,
  uncheckedLst,
  oneUnselected,
  riderDisabledLst,
  setBookedToday,
  setCheckedLst,
  setUncheckedLst,
  setOneUnselected,
  setRiderDisabledLst,
}: TimeslotProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  /**
   * This useEffect is run when the checked prop updates and will set the isChecked useState variable
   * to the new value of checked, this ensures that any external changes to checked are logged in
   * the new isChecked useState variable created here.
   */
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  /**
   * This function is run when the checked button is clicked on volunteer/rider view or the on/off
   * slider is clicked on admin view. If the timeslot is unchecked and the user is checking it then
   * the following will happen:
   *  - If the user is a rider and already has a booking on that day then don't do anything and
   *    return because riders can only have one booking a day.
   *  - If the timeslot wasn't previously booked then add it to the checkedLst useState variable
   *  - Filter the timeslot out of the uncheckedLst if it's in there, this accounts for the case
   *    where the user went to unbook/disable something then changed their mind and wants to keep
   *    it booked or enabled
   *  - Inverse the isChecked useState variable
   *  - Increment the tally of timeslots booked today (bookedToday useState variable), this will be
   *    used to check if riders are trying to book a second slot on the same day.
   *  - If the user is an admin and the slot is riderDisabled then concatenate the current date to
   *    the riderDisabledLst so the confirmaiton can indicate the Admin is impacting rider
   *    availability instead of general availability.
   *  - Finally, if the user is a rider or the current timeslot matches the one held in the
   *    oneSelected useState variable then reset oneSelected to the empty string, oneSelected ensures
   *    that the user only unbooks one slot at a time due to the issue with doing multiple unbookings
   * On the other hand, if the timeslot is already checked and the user goes to uncheck it then the
   * this function will do the following:
   *  - If oneSelected has a timeslotId stored in it and the selected timeslot was previously booked
   *    then don't do anything and return, this prevents volunteers from unbooking more than one at
   *    a time.
   *  - Filter the timeslot out of the checkedLst, this accounts for the case where the user went to
   *    book/enable something then changed their mind and wants to keep it unbooked or disabled
   *  - Inverse the isChecked useState variable
   *  - Decrement the tally of timeslots booked today (bookedToday useState variable)
   *  - If the user is an Admin then add the timeslot to the uncheckedLst so it can be disabled, then
   *    check if it's in riderDisabledLst and if so remove it so we don't show the rider disabling
   *    confirmation messages if there isn't any interaction with rider disabled slots. If it wasn't
   *    in the list previously then unchecking it is an interaction with rider disabling so add it to
   *    riderDisabledLst so the confirmation message can be shown.
   *  - If the slot was previously selected and the user is unchecking it then set the oneSelected
   *    variable to this timeslot's timeslotId, this will be checked to make sure the user doesn't
   *    try to unbook more than one slot at a time. Also add it to the uncheckedLst
   */
  const toggleChecked = () => {
    if (isChecked) {
      if (
        oneUnselected !== "" &&
        previousTimeslots &&
        previousTimeslots.includes(timeslotId)
      ) {
        return;
      }
      setCheckedLst(checkedLst.filter((id) => id !== timeslotId));
      setIsChecked(!isChecked);
      setBookedToday(bookedToday - 1);
      if (userType === "Admin") {
        setUncheckedLst(uncheckedLst.concat(timeslotId));
        if (riderDisabled && riderDisabledLst.includes(timeslotId)) {
          setRiderDisabledLst(
            riderDisabledLst.filter((id) => id !== timeslotId)
          );
        } else if (riderDisabled) {
          setRiderDisabledLst(riderDisabledLst.concat(timeslotId));
        }
      }
      // if it was one of the previous selected timeslots
      if (
        previousTimeslots &&
        previousTimeslots.includes(timeslotId) &&
        userType !== "Admin"
      ) {
        setOneUnselected(timeslotId); // set oneSelected to the current timeslot id so we know something has been unselected
        setUncheckedLst(uncheckedLst.concat(timeslotId)); // Only add it to the unchecked list if it was previously booked
      }
    } else {
      if (bookedToday >= 1 && userType === "Rider") {
        return;
      }
      // only add something to the checkedlist if it wasn't already booked, prevents double booking on same user
      if (previousTimeslots && !previousTimeslots.includes(timeslotId)) {
        setCheckedLst(checkedLst.concat(timeslotId));
      }
      setUncheckedLst(uncheckedLst.filter((id) => id !== timeslotId));
      setIsChecked(!isChecked);
      setBookedToday(bookedToday + 1);
      if (userType === "Admin" && riderDisabled) {
        setRiderDisabledLst(riderDisabledLst.concat(timeslotId));
      }
      // reset the oneSelected if they're riders (can only have one booked anyways) or if its the one that was just unchecked
      if (userType === "Rider" || timeslotId === oneUnselected) {
        setOneUnselected("");
      }
    }
  };

  /**
   * This function formats the time to HH:MM AM/PM format
   * Input:
   *  - time: Date - the date object associated with the timeslots start or end time
   * Output:
   *  - time: string - the time input in HH:MM AM/PM format
   */
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
