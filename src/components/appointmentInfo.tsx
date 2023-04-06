import React from "react";
import styled from "styled-components";
import Horse from "../images/horseRider.svg";
import "@fontsource/roboto";

const Logo = styled.img`
  width: 2.5em;
  display: block;
  padding-right: 10px;
`;

const RiderInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 80%;
  line-height: 19px;
  color: black;
  background: white;
  padding-top: 20px;
`;

export default function AppointmentInfo() {
  return (
    <RiderInfo>
      <Logo src={Horse} /> Riders: Jane Doe, John Smith
    </RiderInfo>
  );
}
