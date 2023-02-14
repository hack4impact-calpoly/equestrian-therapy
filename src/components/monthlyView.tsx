import React, { useState } from "react";
// import styled from "styled-components";
import Calendar from "react-calendar";
import "./monthlyView.css";

export default function weeklyView() {
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
      />
    </div>
  );
}