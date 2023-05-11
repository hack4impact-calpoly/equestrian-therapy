import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DataStore } from "aws-amplify";
import warning from "../../images/warning.svg";
import { Timeslot, User, Booking } from "../../models";

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

export default function TimeSlotConfirmation({
  userType,
  status = "",
}: TimeSlotProps) {
  const navigate = useNavigate();

  const handleConfirmationAdmin = () => {
    navigate("/timeslot-success");
    addUnavailability("5dc2eecb-89bc-4bbf-937c-2ab0ddbd3671", [
      "2023/05/02",
      "2023/05/03",
    ]); // YYYY-MM-DD
    deleteUnavailability("5dc2eecb-89bc-4bbf-937c-2ab0ddbd3671", [
      "2023/05/02",
    ]); // YYYY-MM-DD
  };

  const handleConfirmationRV = () => {
    navigate("/timeslot-success");
    addRVBooking(
      "5dc2eecb-89bc-4bbf-937c-2ab0ddbd3671",
      "5bfff0a7-42aa-48f7-bccb-0fa60dd0b6d3",
      // ["2023/05/05"]
      ["2023/05/05", "2023/05/06", "2023/05/07"]
    );
  };

  const handleCancel = () => {
    navigate("/");
  };

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
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
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
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
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
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <ConfirmButton onClick={handleConfirmationRV}>Book</ConfirmButton>
          </Row>
        </SurroundingBox>
      )}
    </Wrapper>
  );
}
