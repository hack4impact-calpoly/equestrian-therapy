import React from "react";
import styled from "styled-components";
import logo from "../../images/horseRider.svg";
import {
  Button,
  CenteredDescription,
  CenteredHeader,
} from "../styledComponents";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 15%;
  padding-right: 15%;
  padding-bottom: 10%;
`;

const Logo = styled.img`
  width: 2.5em;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

type TimeslotSuccessProps = {
  handleCancelled: () => void;
};

export default function timeslotSuccess({
  handleCancelled,
}: TimeslotSuccessProps) {
  return (
    <Wrapper>
      <Logo src={logo} />
      <CenteredHeader>Success!</CenteredHeader>
      <CenteredDescription>
        You have successfully made changes to one or more time slots.
      </CenteredDescription>
      <Button onClick={handleCancelled}>Return to Calendar</Button>
    </Wrapper>
  );
}
