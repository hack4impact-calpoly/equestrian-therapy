import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Wrapper } from "../styledComponents";
import AppointmentInfo from "../appointmentInfo";

const ButtonPop = styled.button`
  background: #1b4c5a;
  border: solid 0.5px #6c6b6b;
  color: white;
  height: 2.8rem;
  margin-top: 2rem;
  font-weight: bold;
  width: 15%;
  align-self: center;
  cursor: pointer;
`;
const ConfirmButton = styled(Link)`
  background-color: #1b4c5a;
  color: white;
  padding: 14px 25px;
  text-align: center;
  text-decoration: none;
  /* display: inline-block; */
  height: 1rem;
  width: 5rem;
  display: flex;
  justify-content: space-around;
  align-self: flex-end;
  cursor: pointer;
  margin-top: 5%;
  margin-left: 70%;
`;
const ButtonText = styled.text`
  font-weight: bold;
`;

const SurroundingBox = styled(Box)`
  display: flex;
  justify-content: center;
`;
type ToggleProp = {
  toggle: string;
};
export default function AppointmentPopup({ toggle }: ToggleProp) {
  const [popupShown, setPopupShown] = useState(false);
  const togglePopup = () => {
    setPopupShown(!popupShown);
  };
  return (
    <Wrapper>
      <ButtonPop type="button" onClick={togglePopup}>
        Click Me
      </ButtonPop>
      <SurroundingBox style={{ display: popupShown ? "block" : "none" }}>
        <AppointmentInfo toggleProp={toggle} />
        <ConfirmButton type="button" to="/time-slot-confirmation">
          <ButtonText>Book</ButtonText>
        </ConfirmButton>
      </SurroundingBox>
    </Wrapper>
  );
}
