/* eslint-disable no-param-reassign */
import { Link } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import UserContext from "../../userContext";
import MobileTimeslots from "./mobileTimeslots";
import MobileWeeklyView from "./mobileWeeklyView";
import { LazyTimeslot } from "../../models";
import { Dropdown, Option } from "./dropdown";
import signoutarrow from "../../images/signOutArrow.png";
import { Wrapper } from "../styledComponents";

const Box = styled.section`
  border: solid 0.5px #c4c4c4;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  font-family: "Rubik", sans-serif;
  background: white;
  width: 35%;

  @media (max-width: 500px) {
    border: none;
    box-shadow: none;
    display: flex;
    margin-top: 10%;
    padding: 0;
    width: 100%;
  }
`;

const CurrentDate = styled.p`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  margin-left: 12%;
  color: #1b4c5a;
  display: flex;
  align-items: center;
`;

const Disclaimer = styled.p`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  width 80%;
  color: #000d26;
  text-align: left;
  margin-left: 12%;
  margin-top: 0;
  margin-bottom: 0;
`;

const Header1 = styled.text`
  display: none;
  @media (max-width: 500px) {
    padding-top: 25px;
    display: flex;
    align-self: left;
    font-size: 140%;
    padding-bottom: 8%;
    color: #1b4c5a;
  }
`;

const HorizontalFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InvisibleButton = styled(Link)`
  width: 80px;
  height: 80px;
  visibility: hidden;
`;

const StyledButton = styled(Link)`
  width: 80px;
  height: 80px;
  transform: scale(0.5);
`;

const StyledImage = styled.img`
  width: 100%;
`;

interface CalendarProps {
  timeslots: LazyTimeslot[];
  setTs: React.Dispatch<React.SetStateAction<LazyTimeslot[]>>;
}

export default function CalendarMobile({ timeslots, setTs }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [toggleValue, setToggleValue] = useState("");
  const [day, setDayProp] = useState<string>(String(currentDate.getDate()));
  const [month, setMonthProp] = useState<string>(
    String(
      currentDate.toLocaleDateString("en-us", {
        month: "long",
      })
    )
  );
  const [weekday, setWeekdayProp] = useState<string>(
    currentDate.toLocaleDateString("en-us", {
      weekday: "short",
    })
  );
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  // this is to create the current selected date string
  const currentTimeString: string[] = [];
  currentTimeString.push(weekday);
  currentTimeString.push(", ");
  currentTimeString.push(month);
  currentTimeString.push(" ");
  currentTimeString.push(day);

  useEffect(() => {
    currentTimeString.push(weekday);
    currentTimeString.push(", ");
    currentTimeString.push(month);
    currentTimeString.push(" ");
    currentTimeString.push(day);
  }, [month, weekday, day]);

  // this is for the toggle dropdown
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setToggleValue(e.target.value);
  };

  return (
    <Wrapper>
      <Box>
        <HorizontalFlex>
          <InvisibleButton to="/logout" />
          <Header1>Schedule</Header1>
          <StyledButton to="/logout">
            <StyledImage src={signoutarrow} alt="Sign Out" />
          </StyledButton>
        </HorizontalFlex>

        {/* renders the calendar  */}
        <MobileWeeklyView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          setDayProp={setDayProp}
          setMonthProp={setMonthProp}
          setWeekdayProp={setWeekdayProp}
        />

        <HorizontalFlex>
          {/* creates the current selected date */}
          <CurrentDate>{currentTimeString}</CurrentDate>

          {/* this is for the toggle dropdown with different options on different user types */}
          <Dropdown onChange={handleSelect}>
            <Option
              selected
              value={userType === "Admin" ? "Both" : "Availability"}
            />
            <Option
              value={userType !== "Admin" ? "My Slots" : "Riders"}
              selected={undefined}
            />

            {userType === "Admin" ? (
              <Option value="Volunteers" selected={undefined} />
            ) : (
              <div>0</div>
            )}
          </Dropdown>
        </HorizontalFlex>

        {userType === "Admin" &&
        (toggleValue === "Riders" || toggleValue === "Volunteers") ? (
          <Disclaimer>
            {toggleValue === "Riders" ? (
              <p>
                *** Disabling a timeslot with the &quot;Rider only&quot; toggle
                selected will disable it for
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

        {/* the timeslots will change depending on the usertype */}
        <MobileTimeslots
          timeslots={timeslots}
          date={currentDate}
          toggleValue={toggleValue}
          setTs={setTs}
        />
      </Box>
    </Wrapper>
  );
}
