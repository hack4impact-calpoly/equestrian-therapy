import React, { useState, useEffect, useContext, useMemo } from "react";
import styled from "styled-components";
import { DataStore } from "@aws-amplify/datastore";
import x from "../../images/X.svg";
import { PopupDiv, PopupBox, X, CancelBtn, SaveBtn } from "../styledComponents";
import Monthly from "../monthlyView";
import AppointmentInfo from "../appointmentInfo";
import Timeslots from "./timeslots";
import {
  User,
  Timeslot,
  LazyUser,
  LazyBooking,
  LazyTimeslot,
} from "../../models";
import TimeslotConfirmation from "./timeslotConfirmation";
import TimeslotSuccess from "./timeslotSuccess";
import UserContext from "../../userContext";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 90px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px 0 50px;
  // gap: 20px;
  width: 400px;
`;

const RightColumn = styled.div`
  padding-right: 10px;
  width: 500px;
  // flex: 1;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: space-between;
  // width: 80%;
  padding-top: 40px;
  gap: 20px;
`;

const DateHeader = styled.p`
  color: #1b4c5a;
  font-size: 30px;
  font-family: "Roboto";
  font-weight: 700;
  padding-bottom: 10px;
`;

interface PopupProps {
  popup: boolean;
  confirmPopup: boolean;
  handleConfirmOpen: () => void;
  successPopup: boolean;
  handleSuccessOpen: () => void;
  onClose: () => void;
  date: Date;
  timeslots: LazyTimeslot[];
  setTs: React.Dispatch<React.SetStateAction<LazyTimeslot[]>>;
}

interface TsData {
  startTime: Date;
  endTime: Date;
  checked: boolean;
  id: string;
}
function convertToYMD(date: Date) {
  const localString = date.toLocaleDateString();
  const splitDate = localString.split("/");
  let retString = `${localString.split("/")[2]}-`;

  if (splitDate[0].length === 1) {
    retString += `0`;
  }
  retString += `${localString.split("/")[0]}-`;
  if (splitDate[1].length === 1) {
    retString += `0`;
  }
  retString += `${localString.split("/")[1]}`;
  return retString;
}
export default function Popup({
  popup,
  confirmPopup,
  handleConfirmOpen,
  successPopup,
  handleSuccessOpen,
  onClose,
  date,
  timeslots,
  setTs,
}: PopupProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;
  const [bookable, setBookable] = useState<TsData[]>([]);
  const [volunteerBookings, setVolBookings] = useState<LazyUser[]>([]);
  const [riderBookings, setRidBookings] = useState<LazyUser[]>([]);
  const [checkedLst, setCheckedLst] = useState<string[]>([]);
  const [uncheckedLst, setUncheckedLst] = useState<string[]>([]);
  const [bookedToday, setBookedToday] = useState(1);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const getSelected = () => {
    if (popup) {
      return timeslots.find((timeslot) => {
        if (timeslot.startTime) {
          const time = timeslot.startTime.split(":");
          return (
            Number(time[0]) === date.getHours() &&
            Number(time[1]) === date.getMinutes()
          );
        }
        return false;
      });
    }
    return undefined;
  };
  const selected = useMemo(() => getSelected(), [popup]);

  useEffect(() => {
    const ts: TsData[] = [];
    let countBookedToday = 0;
    const fetchBookableRV = async (timeslot: LazyTimeslot) => {
      // available bookings are unbooked bookings, bookings booked by current user, and
      // bookings that are not in the unavailable dates set by admin
      let bookings;
      let countBookings = 0;
      if (userType === "Volunteer") {
        bookings = await timeslot.volunteerBookings.toArray();
      } else {
        bookings = await timeslot.riderBookings.toArray();
      }
      let checked = false;
      let available = true;
      if (bookings) {
        checked = bookings.some((booking) => {
          if (booking.date) {
            if (booking.date === convertToYMD(date)) {
              if (booking.userID === id) {
                countBookings += 1;
                return true;
              }
              available = false;
            }
            return false;
          }
          return false;
        });
      }
      if (
        available &&
        timeslot.unavailableDates &&
        !timeslot.unavailableDates.includes(convertToYMD(date))
      ) {
        ts.push({
          startTime: new Date(`July 4 1776 ${timeslot.startTime}`),
          endTime: new Date(`July 4 1776 ${timeslot.endTime}`),
          checked,
          id: timeslot.id,
        });
      }
      return countBookings;
    };

    const fetchBookableAdmin = async (timeslot: LazyTimeslot) => {
      let checked = true;
      if (
        timeslot.unavailableDates &&
        timeslot.unavailableDates.includes(convertToYMD(date))
      ) {
        checked = false;
      }
      ts.push({
        startTime: new Date(`July 4 1776 ${timeslot.startTime}`),
        endTime: new Date(`July 4 1776 ${timeslot.endTime}`),
        checked,
        id: timeslot.id,
      });
    };

    const fetchBookable = async () => {
      if (timeslots.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const timeslot of timeslots) {
          if (timeslot.startTime && timeslot.endTime) {
            if (userType === "Volunteer" || userType === "Rider") {
              // eslint-disable-next-line no-await-in-loop
              countBookedToday += await fetchBookableRV(timeslot);
            } else {
              fetchBookableAdmin(timeslot);
            }
          }
        }
      }
      setBookable(ts);
      setBookedToday(countBookedToday);
    };
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
      if (!popup) {
        const timeslotsArray = await DataStore.query(Timeslot);
        setTs(timeslotsArray);
      }
      if (selected) {
        const volBookingsArray = await selected.volunteerBookings.toArray(); // turns out the volunteer and rider booking arrays
        // in our objects just return the same thing so there's not really a point to them
        const bookings = await getUsers(volBookingsArray);
        setVolBookings(bookings.volUsers);
        setRidBookings(bookings.ridUsers);
      } else {
        setVolBookings([]);
        setRidBookings([]);
      }
    };
    fetchBookable();
    pullData();
    setCheckedLst([]);
    setUncheckedLst([]);
  }, [popup, selected]);

  return (
    <div>
      <PopupDiv
        open={popup}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <PopupBox>
          <X src={x} onClick={onClose} />
          {!confirmPopup && (
            <Wrapper>
              <LeftColumn>
                <Monthly />
                <AppointmentInfo
                  riderBookings={riderBookings}
                  volunteerBookings={volunteerBookings}
                />
              </LeftColumn>
              <RightColumn>
                <DateHeader>{formattedDate}</DateHeader>
                <Timeslots
                  bookable={bookable}
                  selectedDate={date}
                  bookedToday={bookedToday}
                  checkedLst={checkedLst}
                  uncheckedLst={uncheckedLst}
                  setCheckedLst={setCheckedLst}
                  setUncheckedLst={setUncheckedLst}
                  setBookedToday={setBookedToday}
                />
                <BtnContainer>
                  <CancelBtn onClick={onClose}>Cancel</CancelBtn>
                  <SaveBtn onClick={handleConfirmOpen}>Save</SaveBtn>
                </BtnContainer>
              </RightColumn>
            </Wrapper>
          )}
          {confirmPopup && !successPopup && (
            <TimeslotConfirmation
              handleClicked={handleSuccessOpen}
              handleCancelled={onClose}
              date={date}
              checkedLst={checkedLst}
              uncheckedLst={uncheckedLst}
            />
          )}
          {confirmPopup && successPopup && (
            <TimeslotSuccess handleCancelled={onClose} />
          )}
        </PopupBox>
      </PopupDiv>
    </div>
  );
}
