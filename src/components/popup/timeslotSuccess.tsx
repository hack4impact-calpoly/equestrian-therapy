import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import logo from "../../images/horseRider.svg";
import { Timeslot } from "../../models";
import {
  Wrapper,
  Box,
  Button,
  CenteredDescription,
  CenteredHeader,
} from "../styledComponents";

async function updatePost(
  id: string,
  unavailableDate: (string | null)[] | null | undefined
) {
  // unavailabledate is of form mm/dd/yyyy
  try {
    const original = await DataStore.query(Timeslot, id);
    if (
      original !== null &&
      original !== undefined &&
      Array.isArray(original.unavailableDates) &&
      Array.isArray(unavailableDate)
    ) {
      const updatedList = [...original.unavailableDates, ...unavailableDate];
      if (original && updatedList) {
        const updatedPost = await DataStore.save(
          Timeslot.copyOf(original, (updated) => {
            updated.unavailableDates = updatedList;
          })
        );
        console.log("updated post", updatedPost);
      }
    } else if (original) {
      if (original && Array.isArray(unavailableDate)) {
        const updatedPost = await DataStore.save(
          Timeslot.copyOf(original, (updated) => {
            updated.unavailableDates = unavailableDate;
          })
        );
        console.log("updated post", updatedPost);
      }
    }
  } catch {
    console.log("An error occurred: ", Error);
  }
  console.log("updated timeslot", await DataStore.query(Timeslot, id));
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
    updatePost("89bf61ec-5b7d-44a0-8c0b-4e8321d9cc2a", ["05/02/2023"]);
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
