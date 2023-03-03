import React, { useState } from "react";
import Calendar from "react-calendar";
import "./monthlyView.css";

export default function MonthlyView() {
  const [date, setDate] = useState(new Date());
  const onChange = () => {
    setDate(date);
  };

  const tileDisabled = (thedate: any) => thedate < new Date();

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={date}
        nextLabel=" > "
        prevLabel=" < "
        defaultView="month"
        tileDisabled={tileDisabled}
        view="month"
        calendarType="US"
      />
    </div>
  );
}
