import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import logo from "../../images/horseRider.svg";
import { Booking, User } from "../../models";

/* 
check booking user type
if volunteer, allow time of any length
if rider, only allow list of length 1
add to booking instead of timeslot
be able to search and see if the specific time has been bokked already
*/

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

async function addRVBooking(id: string, user : User) {
  try {
    await DataStore.save(
      new Booking({
        id: ,
        title: ,
        date: ,
        description: , 
        timeslotID: , 
        userID: ,
        createdAt: ,
        updatedAt: ,
      })
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message);
    }
  }
  console.log("Add unavailable times", await DataStore.query(Booking, id));
}

async function deleteUnavailability(id: string, availableDate: string[]) {
  try {
    const original = await DataStore.query(Booking, id);
    if (
      true
    ) {
      
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message);
    }
  }

  console.log("Add available times", await DataStore.query(Booking, id)); // eslint-disable-line no-param-reassign
}

export default function timeslotSuccess() {
  const navigate = useNavigate();

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
