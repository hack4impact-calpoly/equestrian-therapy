import React from "react";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// fake props
// import { bookings } from "./booking";
import { LazyTimeslot } from "../models";

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

interface TimeSlotProps {
  models: LazyTimeslot[];
  toggle: String;
}
let timeslots = [
  {
    startTime: new Date(2023, 2, 7, 9, 0),
    endTime: new Date(2023, 2, 7, 10, 30),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 9, 30),
    endTime: new Date(2023, 2, 7, 10, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 10, 0),
    endTime: new Date(2023, 2, 7, 10, 30),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 10, 35),
    endTime: new Date(2023, 2, 7, 11, 5),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 13, 0),
    endTime: new Date(2023, 2, 7, 14, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 14, 0),
    endTime: new Date(2023, 2, 7, 15, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 15, 0),
    endTime: new Date(2023, 2, 7, 16, 0),
    checked: false,
  },
  {
    startTime: new Date(2023, 2, 7, 16, 0),
    endTime: new Date(2023, 2, 7, 17, 0),
    checked: false,
  },
];

export default function WeeklyView({ models, toggle }: TimeSlotProps) {
  // eslint-disable-next-line
  // const [calTimeslots, setCalTimeslots] = useState(bookings);
  if (models.length !== 0) {
    timeslots = [];
    models.forEach((model) => {
      if (
        typeof model.startTime === "string" &&
        typeof model.endTime === "string"
      ) {
        timeslots.push({
          startTime: new Date(`July 4 1776 ${model.startTime}`),
          endTime: new Date(`July 4 1776 ${model.endTime}`),
          checked: false,
        });
      }
    });
  }
  const updatedSlots = timeslots.map((timeslot) => ({
    start: timeslot.startTime,
    end: timeslot.endTime,
    backgroundColor: "#90BFCC",
    textColor: "black",
  }));
  console.log(updatedSlots);
  console.log(toggle);
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
