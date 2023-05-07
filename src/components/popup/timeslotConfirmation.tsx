import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
const PopupDiv = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
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
const TempButton = styled.button`
  position: absolute;
  top: 10%;
  left: 40%;
`;

export default function TimeSlotConfirmation({
  userType,
  status = "",
}: TimeSlotProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleConfirmation = () => {
    navigate("/timeslot-success");
    setOpen(false);
  };
  return (
    <Wrapper>
      <TempButton onClick={() => setOpen(true)}>Open popup</TempButton>
      <PopupDiv
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SurroundingBox>
          {userType === "admin" && (
            <div>
              <Warning src={warning} />
              <Header>Save changes?</Header>
              <Description>
                You are choosing to edit the availability of one or more time
                slots. Are you sure you want to do this?
              </Description>
              <Row>
                <CancelButton>Cancel</CancelButton>
                <ConfirmButton onClick={handleConfirmation}>
                  Confirm
                </ConfirmButton>
              </Row>
            </div>
          )}
          {userType !== "admin" && status === "cancel" && (
            <div>
              <Warning src={warning} />
              <Header>Confirm cancellation?</Header>
              <Description>
                You are choosing to cancel one or more time slots. Are you sure
                you want to do this?
              </Description>
              <Row>
                <CancelButton>Cancel</CancelButton>
                <ConfirmButton onClick={handleConfirmation}>
                  Confirm
                </ConfirmButton>
              </Row>
            </div>
          )}
          {userType !== "admin" && status === "book" && (
            <div>
              <Warning src={warning} />
              <Header>Confirm booking?</Header>
              <Description>
                You are choosing to book one or more time slots. Are you sure
                you want to do this?
              </Description>
              <Row>
                <CancelButton>Cancel</CancelButton>
                <ConfirmButton onClick={handleConfirmation}>Book</ConfirmButton>
              </Row>
            </div>
          )}
        </SurroundingBox>
      </PopupDiv>
    </Wrapper>
  );
}
