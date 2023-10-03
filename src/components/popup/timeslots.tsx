import { useContext, useState } from "react";
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
  bookedToday,
  selectedDate,
  checkedLst,
  uncheckedLst,
  previousTimeslots,
  riderDisabledLst,
  toggleValue,
  setBookedToday,
  setCheckedLst,
  setRiderDisabledLst,
  setUncheckedLst,
}: TimeslotsProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;
  const [oneUnselected, setOneUnselected] = useState("");

  /**
   * This function filters out timeslots that riders should not be able to book.
   * Input:
   * - ts: TsData - the timeslot
   * Output:
   * - Boolean, whether the timeslot is visible or not
   */
  function filterTimeslots(ts: TsData) {
    if (userType === "Rider" || toggleValue === "Riders") {
      return ts.startTime.getHours() >= 10 && ts.startTime.getHours() < 14;
    }
    return true;
  }

  return (
    <Wrapper>
      <Slots>
        {bookable
          .filter((ts) => filterTimeslots(ts))
          .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
          .map((timeslot, i) => (
            <Timeslot // eslint-disable-next-line react/no-array-index-key
              key={i}
              startTime={timeslot.startTime}
              endTime={timeslot.endTime}
              timeslotId={timeslot.id}
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
              oneUnselected={oneUnselected}
              setOneUnselected={setOneUnselected}
            />
          ))}
      </Slots>
    </Wrapper>
  );
}
