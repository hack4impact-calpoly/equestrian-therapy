import { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import styled from "styled-components";
import caretDown from "../../images/caretDown.svg";
import MobileTimeslotContent from "./mobileTimeslotContent";
import {
  Booking,
  LazyBooking,
  LazyTimeslot,
  LazyUser,
  Timeslot,
  User,
} from "../../models";

const Caret = styled.img`
  margin-left: 10%;
  cursor: pointer;
`;

const Dropdown = styled.section`
  display: flex;
  flex-direction: column;
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

const Text = styled.text`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #000000;
`;

interface TimeslotProps {
  allBookings: Booking[];
  startTime: string;
  endTime: string;
  date: Date;
  backgroundColor: string;
  checked: boolean;
  enabled: boolean;
  riderDisabled: boolean;
  tId: string;
  toggleValue: string;
  setRequery: (requery: boolean) => void;
}

export default function MobileTimeslot({
  allBookings,
  startTime,
  endTime,
  date,
  backgroundColor,
  checked,
  enabled,
  riderDisabled,
  tId,
  toggleValue,
  setRequery,
}: TimeslotProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [volunteerBookings, setVolBookings] = useState<LazyUser[]>([]);
  const [riderBookings, setRidBookings] = useState<LazyUser[]>([]);
  const [selected, setSelected] = useState<LazyTimeslot>();

  // Dropdown toggle handler
  const toggleDropdown = () => {
    // When the handler is invoked inverse the boolean state of isDropdownOpen
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    /**
     * This function is run when the status of the isDropdownOpen useState variable is changed. It
     * will update the selected useState variable to the results of a query of the datastore for a
     * timeslot matching the current tId.
     */
    const getSelected = async () => {
      setSelected(await DataStore.query(Timeslot, tId));
    };
    getSelected();
  }, [isDropdownOpen]);

  useEffect(() => {
    /**
     * This function is called in the pullData function below when the selected useState variable is
     * not undefined. This function will loop through all the bookings linked with this timeslot and
     * for each booking that corresponds with the selected date it will query for that booking's
     * user's object. Then depending on if that user is a Volunteer or a Rider it will push it to
     * either the volUsers or ridUsers array respectively. It will then return an object of both of
     * these arrays.
     * Input:
     *  - bookings: LazyBooking[] - the array of bookings linked to the selected timeslot useState
     *    variable
     * Output:
     *  - { volUsers: User[], ridUsers: User[]} - an object containing the volUsers and ridUsers
     *    arrays, which contain the Volunteer and Rider User objects that have bookings at this time
     */
    const getUsers = async (bookings: LazyBooking[]) => {
      const volUsers: User[] = [];
      const ridUsers: User[] = []; // eslint-disable-next-line no-restricted-syntax
      for await (const booking of bookings) {
        if (
          booking.date &&
          selected &&
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
      return { volUsers, ridUsers };
    };

    /**
     * This function is run when the status of the selected useState variable is changed. If the selected
     * variable has a value then it will fetch the bookings array from the selected object then pass that
     * array to the getUsers function, which will return an object containing two arrays, volunteer and
     * rider booking users. It will then set the volBookings and ridBookings useState variables to these
     * returned arrays.
     * If the selected value is undefined then it will reset these arrays to empty to avoid incorrect
     * values appearing in the appointmentInfo
     */
    const pullData = async () => {
      if (selected) {
        const bookingsArray = await selected.bookings.toArray();
        const bookings = await getUsers(bookingsArray);
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
