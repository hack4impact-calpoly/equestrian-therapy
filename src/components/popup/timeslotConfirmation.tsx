import React from "react";
import styled from "styled-components";
import warning from "../../images/warning.svg";

import {
  Wrapper,
  Box,
  Description,
  Header,
  Button,
  Row,
} from "../styledComponents";

export type TimeSlotProps = {
  userType: String;
  status: String;
};
const Warning = styled.img`
  position: relative;
  width: 80px;
`;

const SurroundingBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const ConfirmButton = styled(Button)`
  width: 11rem;
  height: 3rem;
  margin-left: 1rem;
`;

const CancelButton = styled(Button)`
  width: 11rem;
  height: 3rem;
  background: white;
  color: #1b4c5a;
  margin-right: 1rem;
`;

export default function TimeSlotConfirmation({
  userType,
  status = "",
}: TimeSlotProps) {
  return (
    <Wrapper>
      {userType === "admin" && (
        <SurroundingBox>
          <Warning src={warning} />
          <Header>Save changes?</Header>
          <Description>
            You are choosing to edit the availability of one or more time slots.
            Are you sure you want to do this?
          </Description>
          <Row>
            <CancelButton>Cancel</CancelButton>
            <ConfirmButton>Confirm</ConfirmButton>
          </Row>
        </SurroundingBox>
      )}
      {userType !== "admin" && status === "cancel" && (
        <SurroundingBox>
          <Warning src={warning} />
          <Header>Confirm cancellation?</Header>
          <Description>
            You are choosing to cancel one or more time slots. Are you sure you
            want to do this?
          </Description>
          <Row>
            <CancelButton>Cancel</CancelButton>
            <ConfirmButton>Confirm</ConfirmButton>
          </Row>
        </SurroundingBox>
      )}
      {userType !== "admin" && status === "book" && (
        <SurroundingBox>
          <Warning src={warning} />
          <Header>Confirm booking?</Header>
          <Description>
            You are choosing to book one or more time slots. Are you sure you
            want to do this?
          </Description>
          <Row>
            <CancelButton>Cancel</CancelButton>
            <ConfirmButton>Book</ConfirmButton>
          </Row>
        </SurroundingBox>
      )}
    </Wrapper>
  );
}
