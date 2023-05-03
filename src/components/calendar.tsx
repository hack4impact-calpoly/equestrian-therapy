import styled from "styled-components";
import { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Timeslot, LazyTimeslot } from "../models";
import Monthly from "./monthlyView";
import Weekly from "./weeklyView";
import logo from "../images/PETlogo2.svg";
import Toggle from "./calendarToggle";
import Popup from "./popup/timeslotPopup";

const Logo = styled.img`
  position: absolute;
  right: 2%;
  margin: 2% 4% 0 0;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 130px;
`;
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px 0 50px;
  gap: 40px;
`;
const RightColumn = styled.div`
  padding-right: 50px;
  width: 100%;
`;

export default function Calendar() {
  const [toggles, setToggle] = useState<string>("");
  const [ts, setTs] = useState<LazyTimeslot[]>([]);

  useEffect(() => {
    const pullData = async () => {
      const models = await DataStore.query(Timeslot);
      setTs(models);
      console.log(models);
      console.log(new Date("July 4 1776 14:30"));
    };

    pullData();
  }, []);

  // testing stuff
  console.log(ts);
  console.log(
    `updated ts start time for 1 is: ${
      ts.length === 0 ? "none" : ts[0].startTime
    }`
  );
  console.log(`toggle is ${toggles}`);
  // console.log(`model 1 starttime: ${timeslots[0].startTime}`);
  return (
    <div>
      <Logo src={logo} />
      <Wrapper>
        <LeftColumn>
          <Monthly />
          <Toggle setToggleProp={setToggle} />
        </LeftColumn>
        <RightColumn>
          <Weekly models={ts} toggle={toggles} />
        </RightColumn>
      </Wrapper>
      <Popup />
    </div>
  );
}
