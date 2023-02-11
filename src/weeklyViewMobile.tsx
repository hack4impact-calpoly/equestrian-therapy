import React from "react";
import { WeeklyCalendar } from "antd-weekly-calendar";

const events = [
  {
    eventId: "1",
    startTime: new Date(2021, 3, 21, 12, 0, 0),
    endTime: new Date(2021, 3, 21, 14, 30, 0),
    title: "Ap. 1",
    backgroundColor: "red",
  },
  {
    eventId: "2",
    startTime: new Date(2021, 3, 25, 10, 0, 0),
    endTime: new Date(2021, 3, 25, 17, 15, 0),
    title: "Ap. 1",
    backgroundColor: "red",
  },
];

export default function WeeklyViewMobile() {
  return (
    <div>
      <WeeklyCalendar
        events={events}
        onEventClick={(event) => console.log(event)}
        onSelectDate={(date) => console.log(date)}
      />
    </div>
  );
}
