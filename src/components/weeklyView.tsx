import React, { useState } from "react";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// fake props
import { bookings } from "./booking";

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

export interface WeeklyViewProps {
  start: Date;
  end: Date;
  backgroundColor: "#90BFCC";
  textColor: "black";
}

export default function WeeklyView() {
  // eslint-disable-next-line
  const [calTimeslots, setCalTimeslots] = useState(bookings);

  const updatedSlots = calTimeslots.map((timeslot) => ({
    start: timeslot.startTime,
    end: timeslot.endTime,
    backgroundColor: "#90BFCC",
    textColor: "black",
  }));

  return (
    <CalDiv>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        events={updatedSlots}
        allDaySlot={false}
        slotMinTime="8:00:00"
        slotMaxTime="18:00:00"
        expandRows
        displayEventEnd
        displayEventTime
        dayHeaderFormat={{ weekday: "short", day: "numeric" }}
      />
    </CalDiv>
  );
}
