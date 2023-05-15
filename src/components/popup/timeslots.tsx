import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { Box } from "../styledComponents";
import { DataStore } from "aws-amplify";
import Timeslot from "./timeslot";
import { LazyTimeslot, Timeslot as TimeslotModel } from "../../models";

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
export type TimeSlotProps = {
  userType: string;
};

export default function Timeslots({ userType }: TimeSlotProps) {
  // console.log(models);
  const [timeslotInfo, setTimeslotInfo] = useState<LazyTimeslot[]>([]);
  async function getTsData() {
    setTimeslotInfo(await DataStore.query(TimeslotModel));
  }
  useEffect(() => {
    getTsData();
  }, [userType]);

  function filterTimeSlots(isVolunteers: boolean, ts: LazyTimeslot) {
    if (!ts.startTime || !ts.endTime) {
      return false; // filter out timeslots with null or undefined start or end times
    }

    const startHours = new Date(ts.startTime).getHours();
    const endHours = new Date(ts.endTime).getHours();

    if (isVolunteers) {
      return startHours >= 9 && endHours <= 17;
    }
    return startHours >= 10 && endHours <= 14;
  }

  return (
    <Wrapper>
      <Slots>
        {timeslotInfo
          .filter((ts) => {
            if (!ts) {
              return false; // filter out null or undefined timeslots
            }
            if (
              ts.id === null ||
              ts.id === undefined ||
              ts.id === "null" ||
              ts.id === "undefined" ||
              ts.startTime === null ||
              ts.startTime === undefined ||
              ts.startTime === "null" ||
              ts.startTime === "undefined" ||
              ts.endTime === null ||
              ts.endTime === undefined ||
              ts.endTime === "null" ||
              ts.endTime === "undefined"
            ) {
              return false; // filter out timeslots with null or undefined properties
            }
            return true;
          })
          .filter((ts) => filterTimeSlots(userType === "volunteer", ts))
          .sort((a, b) => {
            const aStartTime = a.startTime
              ? new Date(a.startTime).getTime()
              : -1;
            const bStartTime = b.startTime
              ? new Date(b.startTime).getTime()
              : -1;
            return aStartTime - bStartTime;
          })
          .map((timeslot) => {
            if (
              timeslot.startTime !== undefined &&
              timeslot.startTime !== null &&
              timeslot.endTime !== undefined &&
              timeslot.endTime !== null
            ) {
              return (
                <Timeslot
                  userType={userType}
                  startTime={timeslot.startTime.toString()}
                  endTime={timeslot.endTime}
                  tsID={timeslot.id}
                />
              );
            }
            throw new Error("StartTime is null or undefined");
          })}
      </Slots>
    </Wrapper>
  );
}
