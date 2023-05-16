import React, { useState } from "react";
import "reactjs-popup/dist/index.css";
import styled from "styled-components";
import { Box } from "./styledComponents";
import AppointmentInfo from "./appointmentInfo";

const Button = styled.button`
  background: palevioletred;
  border-radius: 3px;
  border: none;
  color: white;
`;

const Header = styled.h1`
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 125%;
  line-height: 200%;
  background: white;
  color: #1b4c5a;
`;
type PopupProps = {
  toggle: string;
};
export default function AppointmentPopup({ toggle }: PopupProps) {
  const [popupShown, setPopupShown] = useState(false);
  const togglePopup = () => {
    setPopupShown(!popupShown);
  };
  return (
    <div>
      <Button type="button" onClick={togglePopup}>
        Click Me
      </Button>
      <Box style={{ display: popupShown ? "block" : "none" }}>
        <Header>Appointment Info</Header>
        <AppointmentInfo toggleProp={toggle} />
      </Box>
    </div>
  );
}
