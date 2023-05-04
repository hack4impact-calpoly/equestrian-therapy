import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
// import AWSDate from "@aws-amplify/core";
import logo from "../../images/horseRider.svg";
import { Timeslot } from "../../models";
import {
  Wrapper,
  Box,
  Button,
  CenteredDescription,
  CenteredHeader,
} from "../styledComponents";

async function addUnavailability(id: string, unavailableDate: string[]) {
  try {
    const original = await DataStore.query(Timeslot, id);
    if (
      original !== null &&
      original !== undefined &&
      Array.isArray(original.unavailableDates) &&
      Array.isArray(unavailableDate)
    ) {
      const updatedList = new Set(original.unavailableDates);
      const isoDates = new Set(
        unavailableDate.map((dateString) => {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        })
      );
      isoDates.forEach((isoDate) => {
        updatedList.add(isoDate);
      });
      await DataStore.save(
        Timeslot.copyOf(original, (updated) => {
          updated.unavailableDates = Array.from(updatedList); // eslint-disable-line no-param-reassign
        })
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message);
    }
  }
  console.log("Add unavailable times", await DataStore.query(Timeslot, id));
}

async function deleteUnavailability(id: string, availableDate: string[]) {
  try {
    const original = await DataStore.query(Timeslot, id);
    if (
      original !== null &&
      original !== undefined &&
      Array.isArray(original.unavailableDates)
    ) {
      const isoDates = availableDate.map((dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      });
      const updatedList = original.unavailableDates.filter((dateString) => {
        if (dateString !== null) {
          const isoDate = new Date(dateString).toISOString().split("T")[0];
          return !isoDates.includes(isoDate);
        }
        return false;
      });
      await DataStore.save(
        Timeslot.copyOf(original, (updated) => {
          updated.unavailableDates = updatedList; // eslint-disable-line no-param-reassign
        })
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message);
    }
  }

  console.log("Add available times", await DataStore.query(Timeslot, id)); // eslint-disable-line no-param-reassign
}

const Logo = styled.img`
  width: 2.5em;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export default function timeslotSuccess() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
    addUnavailability("5dc2eecb-89bc-4bbf-937c-2ab0ddbd3671", [
      "2023/05/02",
      "2023/05/03",
    ]); // YYYY-MM-DD
    deleteUnavailability("5dc2eecb-89bc-4bbf-937c-2ab0ddbd3671", [
      "2023/05/02",
    ]); // YYYY-MM-DD
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
