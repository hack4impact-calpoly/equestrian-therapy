import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import logo from "../../images/horseRider.svg";
import { Booking, User } from "../../models";
import {
  Wrapper,
  Box,
  Button,
  CenteredDescription,
  CenteredHeader,
} from "../styledComponents";

const Logo = styled.img`
  width: 2.5em;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

async function addRVBooking(
  TimslotID: string,
  userID: string,
  bookedDates: string[]
) {
  try {
    const original = await DataStore.query(User, userID);
    if (
      original !== null &&
      original !== undefined &&
      original.userType === "Volunteer"
    ) {
      const promises = [];
      for (let i = 0; i < bookedDates.length; i++) {
        const isoDate = new Date(bookedDates[i]).toISOString().split("T")[0];
        const descriptionStr: string = `User: ${userID} Booked Time: ${isoDate}`;
        const booking = new Booking({
          title: "New Booking -- Volunteer",
          date: isoDate,
          description: descriptionStr,
          timeslotID: TimslotID,
          userID,
        });
        promises.push(DataStore.save(booking));
      }
      await Promise.all(promises);

    } else if (
      original !== null &&
      original !== undefined &&
      original.userType === "Rider"
    ) {
      if (bookedDates.length === 1) {
        const isoDate = new Date(bookedDates[0]).toISOString().split("T")[0];
        const descriptionStr: string = `User: ${userID} Booked Time: ${isoDate}`;
        const booking = new Booking({
          title: "New Booking",
          date: isoDate,
          description: descriptionStr,
          timeslotID: TimslotID,
          userID,
        });
        await DataStore.save(booking);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message);
    }
  }
}


export default function timeslotSuccess() {
  const navigate = useNavigate();
  // test using RV booking function w/ volunteer and riders
  addRVBooking(
    "5dc2eecb-89bc-4bbf-937c-2ab0ddbd3671",
    "5bfff0a7-42aa-48f7-bccb-0fa60dd0b6d3",
    // ["2023/05/05"]
    ["2023/05/05", "2023/05/06", "2023/05/07"]
  );

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <Box>
        <Logo src={logo} />
        <CenteredHeader>Success!</CenteredHeader>
        <CenteredDescription>
          You have successfully made changes to one or more time slots.
        </CenteredDescription>
        <Button onClick={handleClick}>Return to Calendar</Button>
      </Box>
    </Wrapper>
  );
}
