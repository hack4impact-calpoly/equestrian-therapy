import { useContext } from "react";
import styled from "styled-components";
import UserContext from "../../userContext";
// import { Box } from "../styledComponents";
import Timeslot from "./timeslot";
// import { LazyTimeslot } from "../../models";

const Wrapper = styled.section`
  display: flex;
  align-items: left;
  width: 100%;
  max-height: 400px;
  overflow-y: scroll;
`;

const Slots = styled.div`
  //justify content limits view of timeslots
  /* display: flex; */
  flex-direction: column;
  border: none;
  box-shadow: none;
  width: 100%;
  height: 100%;
  font-family: "Rubik", sans-serif;
`;

interface TsData {
  startTime: Date;
  endTime: Date;
  checked: boolean;
  id: string;
}

interface TimeslotsProps {
  bookable: TsData[];
}

export default function Timeslots({ bookable }: TimeslotsProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  function filterTimeSlots(
    isVolunteers: boolean,
    ts: {
      startTime: Date;
      endTime: Date;
      checked: boolean;
    }
  ) {
    if (isVolunteers) {
      return ts.startTime.getHours() >= 9 && ts.endTime.getHours() < 17;
    }
    return ts.startTime.getHours() >= 10 && ts.startTime.getHours() < 14;
  }

  return (
    <Wrapper>
      <Slots>
        {bookable
          .filter((ts) => filterTimeSlots(userType === "Volunteer", ts))
          .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
          .map((timeslot, i) => (
            <Timeslot // eslint-disable-next-line react/no-array-index-key
              key={i}
              startTime={timeslot.startTime}
              endTime={timeslot.endTime}
              tsId={timeslot.id}
              checked={timeslot.checked}
            />
          ))}
      </Slots>
    </Wrapper>
  );
}
