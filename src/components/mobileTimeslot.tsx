import { useState } from "react";
import styled from "styled-components";
import caretDown from "../images/CaretDown.png";
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

const Slot = styled.section`
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
  width: 310px;
  height: 53px;
`;

const Dropdown = styled.section`
  display: flex;
  flex-direction: column;
`;

interface TimeslotProps {
  startTime: Date;
  endTime: Date;
}

export default function MobileTimeslot({ startTime, endTime }: TimeslotProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user] = useState<string>();
  const [bookings] = useState<number>();

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
      <Slot>
        <Text>{`${formatTime(startTime)} to ${formatTime(endTime)}`}</Text>
        <Caret src={caretDown} onClick={toggleDropdown} />
      </Slot>
      <Dropdown>
        {isDropdownOpen && (
          <MobileTimeslotContent user={user!} bookings={bookings!} />
        )}
      </Dropdown>
    </div>
  );
}
