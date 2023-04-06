/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from "react";
import styled from "styled-components";
import chevronLeft from "../../images/chevronLeft.svg";

const Wrapper = styled.div`
  font-family: "Rubik", sans-serif;
  @media (max-width: 500px) {
    font-size: 80%;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    padding: 8%;
    padding-top: 10%;
  }
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  height: 3rem;
`;
const WeeklySwitch = styled.div`
  @media (max-width: 500px) {
    display: flex;
    font-size: 80%;
    font-weight: bold;
    align-self: start;
  }
`;

const Arrow = styled.button`
  border: none;
  background: none;
  scale: 40%;
`;

const ChevronLeft = styled.img`
  display: block;
`;

const ChevronRight = styled.img`
  display: block;
  transform: scaleX(-1);
`;
const WeekDates = styled.table`
  @media (max-width: 500px) {
    width: 100%;
    padding-top: 5%;
    font-weight: lighter;
    color: #6c6b6b;
    td {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
`;
const Header1 = styled.text`
  display: none;
  @media (max-width: 500px) {
    display: flex;
    align-self: left;
    font-size: 140%;
    padding-bottom: 8%;
    color: #1b4c5a;
  }
`;

const Month = styled.text`
  color: #000000;
  font-weight: bold;
  font-size: 30px;
  @media (max-width: 500px) {
    font-size: 140%;
    align-self: center;
    color: #1b4c5a;
  }
`;

interface WeeklyViewMobileProps {
  startDate: Date;
}

export default function WeeklyViewMobile({ startDate }: WeeklyViewMobileProps) {
  const [currentDate, setCurrentDate] = useState(startDate);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000));
  }

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const handlePrevWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  function getStartOfWeek(day: Date): Date {
    const diff = day.getDate() - day.getDay() + (day.getDay() === -1 ? -7 : 0);
    return new Date(day.setDate(diff));
  }

  return (
    <Wrapper>
      <Head>
        <Header1>Schedule</Header1>
        <WeeklySwitch>
          <Arrow type="button" onClick={handlePrevWeek}>
            <ChevronLeft src={chevronLeft} />
          </Arrow>
          <Month>
            {getStartOfWeek(currentDate).toLocaleDateString("en-us", {
              month: "long",
            })}
          </Month>
          <Arrow type="button" onClick={handleNextWeek}>
            <ChevronRight src={chevronLeft} />
          </Arrow>
        </WeeklySwitch>
        <WeekDates className="subDay">
          <tr>
            {days.map((day) => (
              <th key={day.toDateString()}>
                {day
                  .toLocaleDateString("en-us", {
                    weekday: "narrow",
                  })
                  .toUpperCase()}
              </th>
            ))}
          </tr>
          <tr>
            {days.map((day) => (
              <th key={day.toDateString()}>
                {day.toLocaleDateString("en-us", { day: "numeric" })}
              </th>
            ))}
          </tr>
        </WeekDates>
      </Head>
    </Wrapper>
  );
}
