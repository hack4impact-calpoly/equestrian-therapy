import React, { useState, useEffect, useContext, useMemo } from "react";
import styled from "styled-components";
import { DataStore } from "@aws-amplify/datastore";
import x from "../../images/x.svg";
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

type PopupProps = {
  confirmPopup: boolean;
  date: Date;
  popup: boolean;
  successPopup: boolean;
  timeslots: LazyTimeslot[];
  toggleValue: string;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setTimeslots: React.Dispatch<React.SetStateAction<LazyTimeslot[]>>;
  handleConfirmOpen: () => void;
  handlePopupClose: () => void;
  handleSuccessOpen: () => void;
};

type TsData = {
  id: string;
  checked: boolean;
  startTime: Date;
  endTime: Date;
  riderDisabled: boolean;
};

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
  confirmPopup,
  date,
  popup,
  successPopup,
  timeslots,
  toggleValue,
  setDate,
  setTimeslots,
  handleConfirmOpen,
  handlePopupClose,
  handleSuccessOpen,
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
  const [previousTimeslots, setPreviousTimeslots] = useState<string[]>([]);
  const [riderDisabledLst, setRiderDisabledLst] = useState<string[]>([]);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  /**
   * This function gets the timeslot the user clicks on in the calendar.
   * Input: none
   * Output: none
   */
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
    const ts: TsData[] = [...bookable];
    let countBookedToday = 0;

    /**
     * This function pushes a timeslot to the list of timeslots if it is bookable
     * for riders and volunteers. A bookable timeslot is one that is unbooked and
     * is not in the unavailable dates set by the admin, or one that is booked by the
     * current user. Riders can only book one timeslot in a single day, but volunteers
     * can book multiple.
     * Input:
     * - timeslot: LazyTimeslot - The timeslot to find available bookings of
     * Output:
     *  - countBookings : integer - The number of available bookings for the timeslot
     */
    const fetchBookableRV = async (timeslot: LazyTimeslot) => {
      let countBookings = 0;
      const bookings = await timeslot.bookings.toArray();
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
              if (booking.userType === "Rider" && userType === "Rider") {
                available = false;
              }
            }
            return false;
          }
          return false;
        });
      }

      if (available) {
        // Some days are disabled for riders but not for volunteers
        if (
          timeslot.riderUnavailableDates &&
          timeslot.riderUnavailableDates.includes(convertToYMD(date)) &&
          userType !== "Rider"
        ) {
          ts.push({
            startTime: new Date(`July 4 1776 ${timeslot.startTime}`),
            endTime: new Date(`July 4 1776 ${timeslot.endTime}`),
            checked,
            riderDisabled: false,
            id: timeslot.id,
          });
          // Sundays are disabled by default, unlike other days which are enabled by default.
        } else if (date.getDay() === 0) {
          if (
            timeslot.availableSundays &&
            timeslot.availableSundays.includes(convertToYMD(date))
          ) {
            ts.push({
              startTime: new Date(`July 4 1776 ${timeslot.startTime}`),
              endTime: new Date(`July 4 1776 ${timeslot.endTime}`),
              checked,
              riderDisabled: false,
              id: timeslot.id,
            });
          }
        } else if (
          timeslot.unavailableDates &&
          !timeslot.unavailableDates.includes(convertToYMD(date))
        ) {
          ts.push({
            startTime: new Date(`July 4 1776 ${timeslot.startTime}`),
            endTime: new Date(`July 4 1776 ${timeslot.endTime}`),
            checked,
            riderDisabled: false,
            id: timeslot.id,
          });
        }
      }
      return countBookings;
    };

    /**
     * This function pushes a timeslot to the list of timeslots with its
     * checked/unchecked status for admins.
     * Input:
     * - timeslot: LazyTimeslot - The timeslot to find available bookings of
     * Output: none
     */
    const fetchBookableAdmin = async (timeslot: LazyTimeslot) => {
      let checked = true;
      let riderDisabled = false;
      if (date.getDay() === 0) {
        checked = true;
        if (
          timeslot.availableSundays &&
          !timeslot.availableSundays.includes(convertToYMD(date))
        ) {
          checked = false;
        }
      }
      if (
        timeslot.unavailableDates &&
        timeslot.unavailableDates.includes(convertToYMD(date))
      ) {
        checked = false;
      }
      if (
        timeslot.riderUnavailableDates &&
        timeslot.riderUnavailableDates.includes(convertToYMD(date))
      ) {
        checked = false;
        riderDisabled = true;
      }
      ts.push({
        startTime: new Date(`July 4 1776 ${timeslot.startTime}`),
        endTime: new Date(`July 4 1776 ${timeslot.endTime}`),
        checked,
        riderDisabled,
        id: timeslot.id,
      });
    };

    /**
     * This function pushes all bookable timeslots to the list of timeslots.
     * Input: none
     * Output: none
     */
    const fetchBookable = async () => {
      const selectedTimeslots = [];
      while (ts.length > 0) {
        ts.pop();
      }
      if (timeslots.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const timeslot of timeslots) {
          if (timeslot.startTime && timeslot.endTime) {
            if (userType === "Volunteer" || userType === "Rider") {
              // eslint-disable-next-line no-await-in-loop
              const count = await fetchBookableRV(timeslot);
              countBookedToday += count;
              if (count >= 1) {
                selectedTimeslots.push(timeslot.id);
              }
            } else {
              fetchBookableAdmin(timeslot);
            }
          }
        }
      }
      setPreviousTimeslots(selectedTimeslots);
      setBookable(ts);
      setBookedToday(countBookedToday);
    };

    /**
     * This function gets the lists of users that have booked the given bookings.
     * Input:
     * - bookings: LazyBooking[] - the list of bookings to get users from
     * Output:
     * - volUsers: User[] - the list of volunteer users
     * - ridUsers: User[] - the list of rider users
     */
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

    /**
     * This function is run when the user selects a timeslot in the calendar. It pulls
     * the initial timeslots and bookings.
     * Input: none
     * Output: none
     */
    const pullData = async () => {
      if (!popup) {
        const timeslotsArray = await DataStore.query(Timeslot);
        setTimeslots(timeslotsArray);
      }
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
    fetchBookable();
    pullData();
    setCheckedLst([]);
    setUncheckedLst([]);
  }, [selected, date]);

  return (
    <div>
      <PopupDiv
        open={popup}
        onClose={handlePopupClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <PopupBox>
          <X src={x} onClick={handlePopupClose} />
          {!confirmPopup && (
            <Wrapper>
              <LeftColumn>
                <Monthly date={date} setDate={setDate} />
                <AppointmentInfo
                  riderBookings={riderBookings}
                  volunteerBookings={volunteerBookings}
                  toggleValue={toggleValue}
                />
              </LeftColumn>
              <RightColumn>
                <DateHeader>{formattedDate}</DateHeader>
                <Timeslots
                  bookable={bookable}
                  selectedDate={date}
                  bookedToday={bookedToday}
                  toggleValue={toggleValue}
                  checkedLst={checkedLst}
                  uncheckedLst={uncheckedLst}
                  previousTimeslots={previousTimeslots}
                  riderDisabledLst={riderDisabledLst}
                  setRiderDisabledLst={setRiderDisabledLst}
                  setCheckedLst={setCheckedLst}
                  setUncheckedLst={setUncheckedLst}
                  setBookedToday={setBookedToday}
                />
                <BtnContainer>
                  <CancelBtn onClick={handlePopupClose}>Cancel</CancelBtn>
                  <SaveBtn onClick={handleConfirmOpen}>Save</SaveBtn>
                </BtnContainer>
              </RightColumn>
            </Wrapper>
          )}
          {confirmPopup && !successPopup && (
            <TimeslotConfirmation
              checkedLst={checkedLst}
              uncheckedLst={uncheckedLst}
              date={date}
              toggleValue={toggleValue}
              riderDisabledLst={riderDisabledLst}
              setRiderDisabledLst={setRiderDisabledLst}
              handlePopupClose={handlePopupClose}
              handleSuccessOpen={handleSuccessOpen}
            />
          )}
          {confirmPopup && successPopup && (
            <TimeslotSuccess handleCancelled={handlePopupClose} />
          )}
        </PopupBox>
      </PopupDiv>
    </div>
  );
}
