/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from "react";
import styled from "styled-components";
import chevronLeft from "../../images/chevronLeft.svg";

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

const Head = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  height: 3rem;
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

const WeeklySwitch = styled.div`
  @media (max-width: 500px) {
    display: flex;
    font-size: 80%;
    font-weight: bold;
    align-self: start;
  }
`;

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
  // selected date will start on todays date
  const [selected, setSelected] = useState(new Date().getDay());
  const days: Date[] = [];

  /**
   * This function is run in the for loop below when this component populates its days array,
   * which is used to render the dates that the user can interact with in the horizontal bar.
   * It will take the currently selected date, make a copy, calculate the date of the start of
   * that week and return the a new date whicch is the start date for that week.
   * Input:
   *  - day: Date - the currently selected date
   * Output:
   *  - Date - the first date of the week of the currently selected date
   */
  function getStartOfWeek(day: Date): Date {
    const dateCopy = new Date(day.getTime());
    const diff = dateCopy.getDate() - dateCopy.getDay();
    return new Date(dateCopy.setDate(diff));
  }

  /**
   * This forLoop will populate the days array by calling the getStartOfWeek function above to
   * get the first day of the currently selected week then incrementing through 7 times to add
   * the rest of the days of the week
   */
  for (let i = 0; i < 7; i++) {
    days.push(
      new Date(getStartOfWeek(currentDate).getTime() + i * 24 * 60 * 60 * 1000)
    );
  }

  /**
   * This function is run when the user clicks the right arrow and will set the currentDate to
   * the first day of the following week and set the selected useState variable to that index
   */
  const handleNextWeek = () => {
    setCurrentDate(
      new Date(getStartOfWeek(currentDate).getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    setSelected(0);
  };

  /**
   * This function is run when the user clicks the left arrow and will set the currentDate to
   * the first day of the previous week and set the selected useState variable to that index
   */
  const handlePrevWeek = () => {
    setCurrentDate(
      new Date(getStartOfWeek(currentDate).getTime() - 7 * 24 * 60 * 60 * 1000)
    );
    setSelected(0);
  };

  /**
   * This function is run when the user clicks any of the dates in the horizontal array of dates,
   * it will set the selected useState variable to the selected index and the currentDate useState
   * variable to the date in the days array at that index. Finally, it will set the dayProp,
   * weekdayProp, and monthProp useState variables to the strings of the new date so the current
   * date can be properly displayed to the user
   */
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
