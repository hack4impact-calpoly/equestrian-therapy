/* eslint-disable import/no-duplicates */
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
// import { DataStore } from "@aws-amplify/datastore";
import MonthCalendar from "react-calendar";
import WeekCalendar from "@fullcalendar/react";
import FullCalendarRef from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// import { Timeslot } from "../models";
// import Monthly from "./monthlyView";
// import Weekly from "./weeklyView";
import logo from "../images/PETlogo2.svg";
import Toggle from "./calendarToggle";
import Popup from "./popup/timeslotPopup";
import { bookings } from "./booking";
// import FullCalendar from "@fullcalendar/react";

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
`;

const Logo = styled.img`
  position: absolute;
  right: 2%;
  margin: 2% 4% 0 0;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 130px;
`;
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px 0 50px;
  gap: 40px;
`;
const RightColumn = styled.div`
  padding-right: 50px;
  width: 100%;
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

export default function Calendar() {
  const [date, setDate] = useState(new Date());
  const calRef = useRef<FullCalendarRef>(null);

  console.log("setdate: ", date);
  // const tileDisabled = (thedate: any) => thedate < new Date();

  useEffect(() => {
    const pullData = async () => {
      // const models = await DataStore.query(Timeslot);
      // console.log(models);
      // console.log(new Date("July 4 1776 14:30"));
    };

    pullData();
  }, []);

  const [calTimeslots] = useState(bookings);
  const updatedSlots = calTimeslots.map((timeslot) => ({
    start: timeslot.startTime,
    end: timeslot.endTime,
    backgroundColor: "#90BFCC",
    textColor: "black",
  }));

  return (
    <div>
      <Logo src={logo} />
      <Wrapper>
        <LeftColumn>
          <CalendarContainer>
            <MonthCalendar
              value={date}
              activeStartDate={date}
              nextLabel=" > "
              prevLabel=" < "
              defaultView="month"
              // tileDisabled={tileDisabled}
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
          <Toggle />
        </LeftColumn>
        <RightColumn>
          <CalDiv>
            <WeekCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              initialDate={date}
              events={updatedSlots}
              allDaySlot={false}
              slotMinTime="8:00:00"
              slotMaxTime="18:00:00"
              expandRows
              displayEventEnd
              displayEventTime
              ref={calRef}
              dayHeaderFormat={{ weekday: "short", day: "numeric" }}
              datesSet={(dateInfo) => {
                console.log("start of week: ", dateInfo.start);
                // console.log(dateInfo.end);
                setDate(dateInfo.start);
                console.log("date in weekCal: ", date);
              }}
            />
          </CalDiv>
        </RightColumn>
      </Wrapper>
      <Popup />
    </div>
  );
}
