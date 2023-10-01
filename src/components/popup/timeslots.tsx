// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import UserContext from "../../userContext";
import Timeslot from "./timeslot";

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
  riderDisabled: boolean;
  id: string;
}

type TimeslotsProps = {
  bookable: TsData[];
  selectedDate: Date;
  bookedToday: number;
  toggleValue: string;
  checkedLst: string[];
  uncheckedLst: string[];
  previousTimeslots: string[];
  riderDisabledLst: string[];
  setRiderDisabledLst: React.Dispatch<React.SetStateAction<string[]>>;
  setCheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setUncheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setBookedToday: React.Dispatch<React.SetStateAction<number>>;
};

export default function Timeslots({
  bookable,
  selectedDate,
  bookedToday,
  toggleValue,
  checkedLst,
  uncheckedLst,
  previousTimeslots,
  riderDisabledLst,
  setRiderDisabledLst,
  setCheckedLst,
  setUncheckedLst,
  setBookedToday,
}: TimeslotsProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;
  const [oneSelected, setOneSelected] = useState("");

  function filterTimeSlots(ts: {
    startTime: Date;
    endTime: Date;
    checked: boolean;
  }) {
    if (userType === "Volunteer") {
      return ts.startTime.getHours() >= 9 && ts.startTime.getHours() < 17;
    }
    if (userType === "Rider" || toggleValue === "Riders") {
      return ts.startTime.getHours() >= 10 && ts.startTime.getHours() < 14;
    }
    return ts;
  }

  return (
    <Wrapper>
      <Slots>
        {bookable
          .filter((ts) => filterTimeSlots(ts))
          .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
          .map((timeslot, i) => (
            <Timeslot // eslint-disable-next-line react/no-array-index-key
              key={i}
              startTime={timeslot.startTime}
              endTime={timeslot.endTime}
              tsId={timeslot.id}
              checked={timeslot.checked}
              riderDisabled={timeslot.riderDisabled}
              border={
                timeslot.startTime.getHours() === selectedDate.getHours() &&
                timeslot.startTime.getMinutes() === selectedDate.getMinutes()
                  ? "2px solid #000000"
                  : "1px solid #c4c4c4"
              }
              bookedToday={bookedToday}
              checkedLst={checkedLst}
              uncheckedLst={uncheckedLst}
              previousTimeslots={previousTimeslots}
              riderDisabledLst={riderDisabledLst}
              setRiderDisabledLst={setRiderDisabledLst}
              setBookedToday={setBookedToday}
              setCheckedLst={setCheckedLst}
              setUncheckedLst={setUncheckedLst}
              oneSelected={oneSelected}
              setOneSelected={setOneSelected}
            />
          ))}
      </Slots>
    </Wrapper>
  );
}
