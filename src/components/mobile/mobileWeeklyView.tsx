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
    padding-top: 0%;
  }
  margin-bottom: 16%;
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
    table-layout: fixed;
    width: 100%;
    padding-top: 5%;
    font-weight: lighter;
    color: #6c6b6b;
    td {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
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

// setter props for setting the currently selected date to pass into mobile calendar + start date
interface WeeklyViewMobileProps {
  currentDate: Date;
  setCurrentDate: (val: Date) => void;
  setDayProp: (val: string) => void;
  setMonthProp: (val: string) => void;
  setWeekdayProp: (val: string) => void;
}

export default function WeeklyViewMobile({
  currentDate,
  setCurrentDate,
  setDayProp,
  setMonthProp,
  setWeekdayProp,
}: WeeklyViewMobileProps) {
  const days: Date[] = [];
  // for getting todays day
  const currentTime = new Date();
  const currentDay = currentTime.getDay();
  // selected date will start on todays date
  const [selected, setSelected] = useState(currentDay);

  function getStartOfWeek(day: Date): Date {
    const dateCopy = new Date(day.getTime());
    const diff = dateCopy.getDate() - dateCopy.getDay();
    return new Date(dateCopy.setDate(diff));
  }

  for (let i = 0; i < 7; i++) {
    days.push(
      new Date(getStartOfWeek(currentDate).getTime() + i * 24 * 60 * 60 * 1000)
    );
  }

  const handleNextWeek = () => {
    setCurrentDate(
      new Date(getStartOfWeek(currentDate).getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    setSelected(0);
  };

  const handlePrevWeek = () => {
    setCurrentDate(
      new Date(getStartOfWeek(currentDate).getTime() - 7 * 24 * 60 * 60 * 1000)
    );
    setSelected(0);
  };

  function handleUpdating(i: number) {
    setSelected(i);
    setCurrentDate(days[i]);
    setDayProp(
      days[i].toLocaleDateString("en-us", {
        day: "numeric",
      })
    );
    // setting the currently selected day of the week
    setWeekdayProp(
      days[i].toLocaleDateString("en-us", {
        weekday: "short",
      })
    );
    const month = days[i].toLocaleDateString("en-us", {
      month: "long",
    });
    setMonthProp(month);
  }

  return (
    <Wrapper>
      <Head>
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
            {days.map((day, i) => (
              <th
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                style={{
                  clipPath:
                    i === selected ? "circle(13px at 50% 50%)" : "initial",
                  color: "#000000",
                  background: i === selected ? "#e0eff1" : "initial",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
                onClick={() => {
                  handleUpdating(i);
                }}
              >
                {day.toLocaleDateString("en-us", { day: "numeric" })}
              </th>
            ))}
          </tr>
        </WeekDates>
      </Head>
    </Wrapper>
  );
}
