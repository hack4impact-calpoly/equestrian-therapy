import React from "react";
import styled from "styled-components";
import Horse from "../images/horseRider.svg";
import Dude from "../images/person.svg";
import { LazyUser } from "../models";
import "@fontsource/roboto";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 2.5em;
  padding-right: 10px;
`;

const RiderInfo = styled.div`
  display: flex;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 90%;
  line-height: 19px;
  color: black;
  background: white;

  margin-bottom: 25px;
  margin-left: 2%;
  width: 100%;
`;
const RiderContent = styled.p`
  width: 100%;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 700;
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

type PopupProps = {
  riderBookings: LazyUser[];
  volunteerBookings: LazyUser[];
};

export default function AppointmentInfo({
  riderBookings,
  volunteerBookings,
}: PopupProps) {
  return (
    <Wrapper>
      <AptHeader>Appointment Info</AptHeader>
      <RiderInfo>
        <Logo src={Horse} />
        {riderBookings.length > 0 && (
          <RiderContent>
            Riders:
            {riderBookings
              .map((booking) => {
                if (booking.firstName && booking.lastName) {
                  return " ".concat(booking.firstName, " ", booking.lastName);
                }
                return "";
              })
              .join()}
          </RiderContent>
        )}
      </RiderInfo>

      <RiderInfo>
        <Logo src={Dude} />
        {volunteerBookings.length > 0 && (
          <RiderContent>
            Volunteers:
            {volunteerBookings
              .map((booking) => {
                if (booking.firstName && booking.lastName) {
                  return " ".concat(booking.firstName, " ", booking.lastName);
                }
                return "";
              })
              .join()}
          </RiderContent>
        )}
      </RiderInfo>
    </Wrapper>
  );
}
