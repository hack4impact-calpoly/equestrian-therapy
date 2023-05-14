import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DataStore } from "aws-amplify";
import x from "../../images/X.svg";
import { PopupDiv, PopupBox, X, CancelBtn, SaveBtn } from "../styledComponents";
import Monthly from "../monthlyView";
import AptInfo from "../appointmentInfo";
import Timeslots from "./timeslots";
import { LazyTimeslot, Timeslot } from "../../models";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 90px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px 0 50px;
  // gap: 20px;
  width: 400px;
`;

const RightColumn = styled.div`
  padding-right: 10px;
  width: 500px;
  // flex: 1;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: space-between;
  // width: 80%;
  padding-top: 40px;
  gap: 20px;
`;

const DateHeader = styled.p`
  color: #1b4c5a;
  font-size: 30px;
  font-family: "Roboto";
  font-weight: 700;
  padding-bottom: 10px;
`;

const AptHeader = styled.h1`
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 125%;
  line-height: 200%;
  background: white;
  color: #1b4c5a;
`;

type PopupPropsTS = {
  toggleProp: string;
};

export default function Popup({ o, onData, date, toggleProp }: any) {
  // eslint-disable-next-line
  const [open, setOpen] = useState<boolean>(o);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [timeslots, setTs] = useState<LazyTimeslot[]>([]);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
    setOpen(false);
    onData();
  };

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 500);
      console.log(isMobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const pullData = async () => {
      const ts = await DataStore.query(Timeslot);
      setTs(ts);
      console.log(ts);
    };

    pullData();
  }, []);

  useEffect(() => {
    setOpen(o);
  }, [o]);

  return (
    <div>
      <PopupDiv
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <PopupBox>
          <X src={x} onClick={handleClick} />
          <Wrapper>
            <LeftColumn>
              <Monthly />
              <AptHeader>Appointment Info</AptHeader>
              {/* <AptInfo /> */}
              <AptInfo toggleProp={toggleProp} />
            </LeftColumn>
            <RightColumn>
              <DateHeader>{formattedDate}</DateHeader>
              <Timeslots
                userType="rider"
                models={timeslots}
                date={new Date()}
              />
              <BtnContainer>
                <CancelBtn>Cancel</CancelBtn>
                <SaveBtn>Save</SaveBtn>
              </BtnContainer>
            </RightColumn>
          </Wrapper>
        </PopupBox>
      </PopupDiv>
    </div>
  );
}
