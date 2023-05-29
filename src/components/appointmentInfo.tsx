import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DataStore } from "@aws-amplify/datastore";
import Horse from "../images/horseRider.svg";
import Dude from "../images/person.svg";
import { Booking, User, Timeslot } from "../models";
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
const RiderContent = styled.text`
  flex-direction: row;
  width: 100%;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 700;
`;
type PopupProps = {
  toggleProp: string;
};

export default function AppointmentInfo({ toggleProp }: PopupProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeslot, setTimeslot] = useState<Timeslot>();

  useEffect(() => {
    const pullData = async () => {
      const bookingModels = await DataStore.query(Booking);
      setBookings(bookingModels);
    };

    pullData();
  }, []);
  useEffect(() => {
    const pullData = async () => {
      const userModel = await DataStore.query(User);
      setUsers(userModel);
    };

    pullData();
  }, []);

  const RiderNames = () => {
    if (timeslot) {
      const riderBookings = bookings.filter(
        (booking) => booking.timeslotID === timeslot.id
      );
      const riderUserIds = riderBookings.map((booking) => booking.userID);
      const riderUsers = users.filter((user) => riderUserIds.includes(user.id));
      const riderNames = riderUsers.map(
        (user) => `${user.firstName} ${user.lastName}`
      );
      return riderNames;
    }
    return [];
  };

  const VolunteerNames = () => {
    if (timeslot) {
      const volunteerBookings = bookings.filter(
        (booking) => booking.timeslotID === timeslot.id
      );
      const volunteerUserIds = volunteerBookings.map(
        (booking) => booking.userID
      );
      const volunteerUsers = users.filter((user) =>
        volunteerUserIds.includes(user.id)
      );
      const volunteerNames = volunteerUsers.map(
        (user) => `${user.firstName} ${user.lastName}`
      );
      return volunteerNames;
    }
    return [];
  };

  return (
    <Wrapper>
      <RiderInfo style={{ display: "block" }}>
        <Logo src={Horse} />
        <RiderContent>Riders: {RiderNames().join(", ")}</RiderContent>
      </RiderInfo>

      <RiderInfo
        style={{
          display:
            toggleProp === "admin" || toggleProp === "volunteer"
              ? "block"
              : "none",
        }}
      >
        <Logo src={Dude} />
        <RiderContent>Volunteers: {VolunteerNames().join(", ")}</RiderContent>
      </RiderInfo>
    </Wrapper>
  );
}
