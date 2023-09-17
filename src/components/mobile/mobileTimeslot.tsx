import { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import styled from "styled-components";
import caretDown from "../../images/caretDown.svg";
import MobileTimeslotContent from "./mobileTimeslotContent";
import {
  Timeslot,
  User,
  LazyUser,
  LazyBooking,
  LazyTimeslot,
  Booking,
} from "../../models";

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

const Slot = styled.section<{ backgroundColor: string }>`
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
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Dropdown = styled.section`
  display: flex;
  flex-direction: column;
`;

interface TimeslotProps {
  startTime: string;
  endTime: string;
  date: Date;
  backgroundColor: string;
  checked: boolean;
  enabled: boolean;
  riderDisabled: boolean;
  tId: string;
  allBookings: Booking[];
  setRequery: (requery: boolean) => void;
  toggleValue: string;
}

export default function MobileTimeslot({
  startTime,
  endTime,
  date,
  backgroundColor,
  tId,
  checked,
  enabled,
  riderDisabled,
  allBookings,
  setRequery,
  toggleValue,
}: TimeslotProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [volunteerBookings, setVolBookings] = useState<LazyUser[]>([]);
  const [riderBookings, setRidBookings] = useState<LazyUser[]>([]);
  const [selected, setSelected] = useState<LazyTimeslot>();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const getSelected = async () => {
      setSelected(await DataStore.query(Timeslot, tId));
    };
    getSelected();
  }, [isDropdownOpen]);

  useEffect(() => {
    const getUsers = async (bookings: LazyBooking[]) => {
      const volUsers: User[] = [];
      const ridUsers: User[] = []; // eslint-disable-next-line no-restricted-syntax
      for await (const booking of bookings) {
        if (booking.date) {
          if (selected) {
            if (
              Number(booking.date.substring(0, 4)) === date.getFullYear() &&
              Number(booking.date.substring(5, 7)) === date.getMonth() + 1 &&
              Number(booking.date.substring(8, 10)) === date.getDate() &&
              booking.timeslotID === selected.id
            ) {
              const user = await DataStore.query(User, booking.userID);
              if (user) {
                if (user.userType === "Volunteer") {
                  volUsers.push(user);
                } else if (user.userType === "Rider") {
                  ridUsers.push(user);
                }
              }
            }
          }
        }
      }
      return { volUsers, ridUsers };
    };
    const pullData = async () => {
      // if (!popup) {
      //   const timeslotsArray = await DataStore.query(Timeslot);
      //   setTs(timeslotsArray);
      // }
      if (selected) {
        // console.log(selected);
        const volBookingsArray = await selected.bookings.toArray(); // turns out the volunteer and rider booking arrays
        // in our objects just return the same thing so there's not really a point to them
        const bookings = await getUsers(volBookingsArray);
        setVolBookings(bookings.volUsers);
        setRidBookings(bookings.ridUsers);
      } else {
        setVolBookings([]);
        setRidBookings([]);
      }
    };
    pullData();
  }, [selected]);

  return (
    <div>
      <Slot backgroundColor={backgroundColor}>
        <Text>{`${startTime} to ${endTime}`}</Text>
        <Caret src={caretDown} onClick={toggleDropdown} />
      </Slot>
      <Dropdown>
        {isDropdownOpen && (
          <MobileTimeslotContent
            date={date}
            tId={tId}
            riderBookings={riderBookings}
            volunteerBookings={volunteerBookings}
            booked={checked}
            enabled={enabled}
            riderDisabled={riderDisabled}
            allBookings={allBookings}
            setRequery={setRequery}
            toggleValue={toggleValue}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        )}
      </Dropdown>
    </div>
  );
}
