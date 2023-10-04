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

type TsData = {
  id: string;
  startTime: Date;
  endTime: Date;
  checked: boolean;
  riderDisabled: boolean;
};

type TimeslotsProps = {
  bookable: TsData[];
  previousTimeslots: string[];
  selectedDate: Date;
  toggleValue: string;
  bookedToday: number;
  checkedLst: string[];
  uncheckedLst: string[];
  riderDisabledLst: string[];
  setBookedToday: React.Dispatch<React.SetStateAction<number>>;
  setCheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setUncheckedLst: React.Dispatch<React.SetStateAction<string[]>>;
  setRiderDisabledLst: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Timeslots({
  bookable,
  previousTimeslots,
  selectedDate,
  toggleValue,
  bookedToday,
  checkedLst,
  uncheckedLst,
  riderDisabledLst,
  setBookedToday,
  setCheckedLst,
  setUncheckedLst,
  setRiderDisabledLst,
}: TimeslotsProps) {
  const [oneUnselected, setOneUnselected] = useState("");
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

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
              timeslotId={timeslot.id}
              startTime={timeslot.startTime}
              endTime={timeslot.endTime}
              border={
                timeslot.startTime.getHours() === selectedDate.getHours() &&
                timeslot.startTime.getMinutes() === selectedDate.getMinutes()
                  ? "2px solid #000000"
                  : "1px solid #c4c4c4"
              }
              checked={timeslot.checked}
              previousTimeslots={previousTimeslots}
              riderDisabled={timeslot.riderDisabled}
              bookedToday={bookedToday}
              checkedLst={checkedLst}
              uncheckedLst={uncheckedLst}
              oneUnselected={oneUnselected}
              riderDisabledLst={riderDisabledLst}
              setBookedToday={setBookedToday}
              setCheckedLst={setCheckedLst}
              setUncheckedLst={setUncheckedLst}
              setOneUnselected={setOneUnselected}
              setRiderDisabledLst={setRiderDisabledLst}
            />
          ))}
      </Slots>
    </Wrapper>
  );
}
