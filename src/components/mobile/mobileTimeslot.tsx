import { useState } from "react";
import styled from "styled-components";
import caretDown from "../../images/CaretDown.svg";
import { LazyTimeslot } from "../../models";
import MobileTimeslotContent from "./mobileTimeslotContent";

const Caret = styled.img`
  margin-left: 10%;
  cursor: pointer;
`;

const Text = styled.text`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #000000;
`;

// width was 310px
const Slot = styled.section<{ isBooked: boolean; isDisabled: boolean }>`
  display: flex;
  flex-direction: row;
  font-family: "Rubik", sans-serif;
  align-items: center;
  justify-content: center;
  margin: 4%;
  box-sizing: border-box;
  background: rgba(144, 191, 204, 0.7);
  border: 1px solid #c4c4c4;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 80%;
  height: 53px;

  // Conditional COLORING for timeSlots ->
  background-color: ${({ isBooked, isDisabled }) => {
    if (isBooked) {
      return "#E0EFF1";
    }
    if (isDisabled) {
      return "#E0EFF1";
    }
    return "rgba(144, 191, 204, 0.7)";
  }};
`;

const Dropdown = styled.section`
  display: flex;
  flex-direction: column;
`;

interface TimeslotProps {
  startTime: Date;
  endTime: Date;
  user: string;
  isDisabled: boolean;
  isBookedVolunteer: boolean;
  isBookedRider: boolean;
  userType: "volunteer" | "rider" | "admin";
}

export default function MobileTimeslot({
  startTime,
  endTime,
  user,
  isDisabled,
  isBookedVolunteer,
  isBookedRider,
  userType,
}: TimeslotProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [user] = useState<string>();
  const [bookings] = useState<number>();
  const [timeslots, setTs] = useState<LazyTimeslot[]>([]);
  // const [timeslots, setTimeslots] = useState<LazyTimeslot[]>(bookings);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div>
      <Slot isBooked={userType === "rider" ? isBookedRider : isBookedVolunteer}
        isDisabled={isDisabled}>
        <Text>{`${formatTime(startTime)} to ${formatTime(endTime)}`}</Text>
        <Caret src={caretDown} onClick={toggleDropdown} />
      </Slot>
      <Dropdown>
        {isDropdownOpen && (
          <MobileTimeslotContent user={user} bookings={bookings!} />
        )}
      </Dropdown>
    </div>
  );
}
