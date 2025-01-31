/* eslint-disable no-console */
/* eslint-disable import/no-duplicates */
import styled from "styled-components";
import { useEffect, useState, useRef, useContext } from "react";
import { DataStore } from "@aws-amplify/datastore";
import MonthCalendar from "react-calendar";
import WeekCalendar from "@fullcalendar/react";
import FullCalendarRef from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// eslint-disable-next-line import/no-extraneous-dependencies
import interactionPlugin from "@fullcalendar/interaction";
import UserContext from "../userContext";
import { Booking, LazyTimeslot } from "../models";
import logo from "../images/petLogo2.svg";
import signout from "../images/signOut.png";
import LogoutPopup from "./popup/logoutPopup";
import Popup from "./popup/timeslotPopup";
import Toggle from "./calendarToggle";

const CalDiv = styled.div`
  font-family: "Rubik", sans-serif;
  // width: 100%;
  td {
    text-align: center;
    font-weight: bold;
  }
  .fc {
    height: 700px;
  }
  .fc-toolbar {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }
  .fc-prev-button,
  .fc-next-button {
    margin-right: 10px;
    margin-left: 0;
    background-color: white;
    border: none;
  }
  .fc-prev-button span::before,
  .fc-next-button span::before {
    color: #6c6b6b;
  }
  .fc-prev-button:hover,
  .fc-next-button:hover {
    background-color: white;
  }
  .fc-prev-button:active:focus,
  .fc-next-button:active:focus {
    background-color: white;
    border: none;
  }
  .fc-today-button {
    display: none;
  }
  .fc-event {
    cursor: pointer;
  }
`;

const CalendarContainer = styled.div`
  .react-calendar {
    width: 350px;
    max-width: 100%;
    border: none;
    font-family: "Rubik";
    line-height: 1.125em;
  }
  .react-calendar--doubleView {
    width: 700px;
  }
  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5em;
  }
  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }
  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;
  }
  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }
  .react-calendar__navigation button.react-calendar__navigation__prev-button {
    order: 1;
  }
  .react-calendar__navigation button.react-calendar__navigation__next-button {
    order: 2;
  }
  .react-calendar__navigation button.react-calendar__navigation__today-button {
    order: -1;
  }
  .react-calendar__navigation button:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: none;
  }
  .react-calendar__navigation__label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-family: "Rubik";
    font-size: 18px;
    font-weight: bolder;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    font-weight: bold;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: white;
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }
  .react-calendar__tile {
    max-width: 100%;
    padding: 10px 6.6667px;
    background: none;
    text-align: center;
    line-height: 16px;
  }
  .react-calendar__tile:disabled {
    background-color: grey;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }
  .react-calendar__tile--now {
    background: white;
    box-shadow: 0px 0px 0px 1px #04b2d9 inset;
  }
  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }
  .react-calendar__navigation__arrow.react-calendar__navigation__prev2-button,
  .react-calendar__navigation__arrow.react-calendar__navigation__next2-button {
    display: none;
  }
`;

const Disclaimer = styled.p`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  width: 350px;
  max-width: 100%;
  color: #000d26;
  text-align: left;
  margin: 0px;
`;

const Logo = styled.img`
  position: absolute;
  right: 2%;
  margin: 2% 4% 0 0;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px 0 50px;
  gap: 20px;
`;
const RightColumn = styled.div`
  padding-right: 50px;
  width: 100%;
`;

const SignOutLogo = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled.button`
  display: inline-block;
  width: 100px;
  height: 100px;
  transform: scale(1.2);
  padding-top: 20px;
  background: none;
  border: none;
`;

const StyledImage = styled.img`
  width: 100%;
  padding-top: 30%;
  padding-left: 40%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 60px;
`;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CalendarProps = {
  timeslots: LazyTimeslot[];
  setTimeslots: React.Dispatch<React.SetStateAction<LazyTimeslot[]>>;
};

type Timeslot = {
  timeslotId: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  enabled: boolean;
  textColor: string;
};

/**
 * This function takes a javascript Date object and converts it to a string in YYYY-MM-DD format
 * Input:
 *  - date: Date - The date object to be converted to YYYY-MM-DD format
 * Output:
 *  - retString: string - the string version of the date in YYYY-MM-DD format
 */
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

export default function Calendar({ timeslots, setTimeslots }: CalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState(new Date());
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [popup, setPopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [toggleValue, setToggleValue] = useState<string>("");
  const [popupDate, setPopupDate] = useState<Date>(new Date());
  const calRef = useRef<FullCalendarRef>(null);
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userType, id: currentUserId } = realUser;

  /**
   * This useEffect is run when the popup useState variable updates and will fetch all of the
   * bookings from the DataStore and will set the response to the bookings useState variable
   */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingModels = await DataStore.query(Booking);
        setBookings(bookingModels);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [popup]);

  /**
   * This function is run when the user selects a timeslot event on the weekly calendar.
   * It will set the popups date to the selected timeslots start time date object, then wait
   * briefly before opening the popup for the user.
   */
  const handleEventClick = async (eventClickInfo: any) => {
    setPopupDate(eventClickInfo.event.start);
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 200));
    setPopup(true);
  };

  /**
   * This function is run when the user clicks the Save button in the timeslotPopup, it will
   * open the timeslotConfirmation component in place of the timeslots.
   */
  const handleConfirmOpen = () => {
    setConfirmPopup(true);
  };

  /**
   * This function is run when the user clicks the Cancel button in the logoutPopup, it will
   * close the logoutPopup.
   */
  const handleLogoutClose = () => {
    setLogoutPopup(false);
  };

  /**
   * This function is run when the user clicks the X button in the timeslotPopup, it will
   * close the timeslotPopup as well as the confirmPopup and successPopup if they're open
   */
  const handlePopupClose = () => {
    setPopup(false);
    setConfirmPopup(false);
    setSuccessPopup(false);
  };

  /**
   * This function is run when the user clicks the Confirm button in the timeslotConfirmation
   * component, it will open the timeslotSuccess component in place of the confirmation page
   */
  const handleSuccessOpen = () => {
    setSuccessPopup(true);
  };

  let slots: Timeslot[] = [];

  /**
   * This for loop is run for everyday of the week of the currently selected week. For each day
   * it will loop through all the time timeslots on that day and transform them into the
   * information needed for that timeslot object
   */
  for (let dateoffset = 0; dateoffset < 7; dateoffset++) {
    const dateCopy = new Date(date.getTime());
    const dateTest = new Date(
      dateCopy.setDate(dateCopy.getDate() + dateoffset)
    );

    /**
     * This map function takes a timeslot as input and transforms it into all of the information
     * needed to render the timeslot in the WeekCalendar to the user, it pushes it to slots afterwards
     * Input:
     *  - timeslot: LazyTimeslot - a timeslot fetched from the dataStore
     * Output:
     *  - A Temp timeslot with the following fields:
     *      timeslotId: string - the id of the timeslot, from the DataStore
     *      startTime: string - the startTime of the timeslot, from the DataStore
     *      endTime: string - the endTime of the timeslot, from the Datastore
     *      backgroundColor: string - the hexcode of the background color of the rendered
     *                       MobileTimeslot, will be blue by default, light blue/grey if booked,
     *                       dark blue if rider disabled and the user is an admin, or dark grey
     *                       if the slot is disabled and the user is an admin.
     *      enabled: boolean - whether or not the timeslot is enabled, timeslots are enabled by
     *               default except for on sundays, at which point they need to be enabled by being
     *               added to the availableSundays array
     *      riderDisabled: boolean - whether or not the timeslot is riderDisabled, from the DataStore
     */
    const tempSlots = timeslots.map((timeslot: LazyTimeslot) => {
      let backgroundColor = "#90BFCC";
      let enabled = true;
      const startingTime = new Date(
        `${
          months[dateTest.getMonth()]
        } ${dateTest.getDate()}, ${dateTest.getFullYear()} ${
          timeslot.startTime
        }:00`
      );
      const endingTime = new Date(
        `${
          months[dateTest.getMonth()]
        } ${dateTest.getDate()}, ${dateTest.getFullYear()} ${
          timeslot.endTime
        }:00`
      );
      // If date is a Sunday, disabled the slot by default, if admin set background color to dark grey
      if (dateTest.getDay() === 0) {
        if (userType === "Admin") {
          backgroundColor = "#C1C1C1";
        } else {
          enabled = false;
        }
        if (
          timeslot.availableSundays &&
          timeslot.availableSundays.includes(convertToYMD(dateTest))
        ) {
          if (userType === "Admin") {
            backgroundColor = "#90BFCC";
          } else if (userType === "Volunteer") {
            enabled = true;
          }
        }
      }
      // Non-Sunday dates check unavailableDates, then set enabled to false (or dark grey for admins)
      else if (
        timeslot.unavailableDates &&
        timeslot.unavailableDates.includes(convertToYMD(dateTest))
      ) {
        if (userType === "Admin") {
          backgroundColor = "#C1C1C1";
        } else {
          enabled = false;
        }
      }
      // If the timeslot is rider disabled then disable it for riders,
      // set the color to dark blue & uncheck it for admin, enable for volunteer
      if (
        timeslot.riderUnavailableDates &&
        timeslot.riderUnavailableDates.includes(convertToYMD(dateTest))
      ) {
        if (userType === "Rider") {
          enabled = false;
        } else if (userType === "Admin") {
          backgroundColor = "#708BDB";
        } else {
          enabled = true;
        }
      }
      /**
       * The following gross if statement is to determine if the timeslot has a booking or not on
       * this date. If there is a booking for this slot then change the backround color to light grey.
       * The conditions for when you would want to color a timeslot are as follows:
       *  - If the user is a Rider or the user is an Admin with the Riders toggle selected and the
       *    timeslot has a booking from a Rider (doesn't have to be the current user)
       *  - If the user is an Admin with the Both toggle selected or the user is a Volunteer and there
       *    is a booking from any other user
       *  - If the user is an Admin with the Volunteers toggle selected and there is a booking from any
       *    Volunteer
       */
      if (
        ((userType === "Rider" || toggleValue === "Riders") &&
          bookings.some(
            (booking) =>
              booking.timeslotID === timeslot.id &&
              dateTest.getDate() ===
                Number(
                  String(booking.date).substring(
                    String(booking.date).length - 2,
                    String(booking.date).length
                  )
                ) &&
              dateTest.getMonth() + 1 ===
                Number(String(booking.date).substring(5, 7)) &&
              dateTest.getFullYear() ===
                Number(String(booking.date).substring(0, 4)) &&
              booking.userType === "Rider"
          )) ||
        ((toggleValue === "Both" || userType === "Volunteer") &&
          bookings.some(
            (booking) =>
              booking.timeslotID === timeslot.id &&
              dateTest.getDate() ===
                Number(
                  String(booking.date).substring(
                    String(booking.date).length - 2,
                    String(booking.date).length
                  )
                ) &&
              dateTest.getMonth() + 1 ===
                Number(String(booking.date).substring(5, 7)) &&
              dateTest.getFullYear() ===
                Number(String(booking.date).substring(0, 4))
          )) ||
        (userType === "Admin" &&
          toggleValue === "Volunteers" &&
          bookings.some(
            (booking) =>
              booking.timeslotID === timeslot.id &&
              dateTest.getDate() ===
                Number(
                  String(booking.date).substring(
                    String(booking.date).length - 2,
                    String(booking.date).length
                  )
                ) &&
              dateTest.getMonth() + 1 ===
                Number(String(booking.date).substring(5, 7)) &&
              dateTest.getFullYear() ===
                Number(String(booking.date).substring(0, 4)) &&
              booking.userType === "Volunteer"
          ))
      ) {
        backgroundColor = "#E0EFF1";
      }

      return {
        timeslotId: timeslot.id,
        start: startingTime,
        end: endingTime,
        backgroundColor,
        enabled,
        textColor: "black",
      };
    });
    slots = slots.concat(tempSlots);
  }

  // Filter out any disabled slots
  slots = slots.filter((timeslot) => timeslot.enabled);

  // If the user is a Rider or the Riders toggle is on, only show slots between 10am and 2pm
  if (toggleValue === "Riders" || userType === "Rider") {
    slots = slots.filter(
      (timeslot) =>
        timeslot.start.getHours() >= 10 && timeslot.start.getHours() < 14
    );
  }
  // If the My Slots toggle is selected then only show slots that the current user has booked
  if (toggleValue === "slots") {
    slots = slots.filter((timeslot) =>
      bookings.some(
        (booking) =>
          booking.userID === currentUserId &&
          booking.timeslotID === timeslot.timeslotId &&
          booking.date === convertToYMD(timeslot.start)
      )
    );
  }

  return (
    <div>
      <SignOutLogo>
        <StyledButton
          onClick={() => {
            setLogoutPopup(true);
          }}
        >
          <StyledImage src={signout} alt="Sign Out" />
        </StyledButton>
        <Logo src={logo} />
        <LogoutPopup openProp={logoutPopup} onClose={handleLogoutClose} />
      </SignOutLogo>
      <Wrapper>
        <LeftColumn>
          <CalendarContainer>
            <MonthCalendar
              value={date}
              activeStartDate={date}
              nextLabel=" > "
              prevLabel=" < "
              defaultView="month"
              view="month"
              calendarType="US"
              onClickDay={(day) => {
                setDate(day);
                calRef.current?.getApi()?.gotoDate(day);
              }}
              onClickMonth={(day) => {
                setDate(day);
                calRef.current?.getApi()?.gotoDate(day);
              }}
            />
          </CalendarContainer>
          <Toggle setToggleValue={setToggleValue} />
          {userType === "Admin" && toggleValue !== "Both" ? (
            <Disclaimer>
              {toggleValue === "Riders" ? (
                <p>
                  *** Disabling a timeslot with the &quot;Rider only&quot;
                  toggle selected will disable it for
                  <span style={{ fontWeight: "bold" }}> riders only</span>
                </p>
              ) : (
                <p>
                  *** Enabling a disabled timeslot with the &quot;Volunteer
                  only&quot; toggle selected will enable it for
                  <span style={{ fontWeight: "bold" }}> volunteers only</span>
                </p>
              )}
            </Disclaimer>
          ) : (
            <div />
          )}
        </LeftColumn>
        <RightColumn>
          <CalDiv>
            <WeekCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={date}
              events={slots}
              allDaySlot={false}
              slotMinTime="8:00:00"
              slotMaxTime="18:00:00"
              expandRows
              displayEventEnd
              displayEventTime
              ref={calRef}
              dayHeaderFormat={{ weekday: "short", day: "numeric" }}
              datesSet={(dateInfo) => {
                setDate(dateInfo.start);
              }}
              eventClick={handleEventClick}
            />
            <Popup
              confirmPopup={confirmPopup}
              popup={popup}
              successPopup={successPopup}
              toggleValue={toggleValue}
              date={popupDate}
              timeslots={timeslots}
              setDate={setPopupDate}
              setTimeslots={setTimeslots}
              handleConfirmOpen={handleConfirmOpen}
              handlePopupClose={handlePopupClose}
              handleSuccessOpen={handleSuccessOpen}
            />
          </CalDiv>
        </RightColumn>
      </Wrapper>
    </div>
  );
}
