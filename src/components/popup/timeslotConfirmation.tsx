import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DataStore } from "aws-amplify";
import { Modal } from "@mui/material";
import warning from "../../images/warning.svg";
import { Timeslot, User, Booking } from "../../models";
import {
  Wrapper,
  SurroundingBoxPopup,
  Description,
  Header,
  Button,
  Row,
} from "../styledComponents";

export type TimeSlotProps = {
  userType: String;
  status: String;
  timeslotID: string;
  userID: string;
  dates: string[];
};
const PopupDiv = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Warning = styled.img`
  position: relative;
  width: 80px;
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
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
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
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
}

async function addRVBooking(
  TimeslotID: string,
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
          timeslotID: TimeslotID,
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
          timeslotID: TimeslotID,
          userID,
        });
        await DataStore.save(booking);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
}

async function deleteRVBooking(
  TimeslotID: string, // which day they want to cancel
  userID: string,
  cancelDates: string[] // can cancel multiple dates
) {
  /*
  go through entire booking table, find the booking id that matches
  the timeslotid, and the date
   */
  try {
    const BookingTable = await DataStore.query(Booking);
    BookingTable.forEach((booking) => {
      if (booking.userID === userID && booking.timeslotID === TimeslotID) {
        cancelDates.forEach((date) => {
          const isoDate = new Date(date).toISOString().split("T")[0];
          if (isoDate === booking.date) {
            DataStore.delete(booking);
          }
        });
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
}
export default function TimeSlotConfirmation({
  userType,
  status = "",
  timeslotID,
  userID,
  dates,
}: TimeSlotProps) {
  const open = true;
  const navigate = useNavigate();

  const handleConfirmationAdmin = () => {
    addUnavailability(timeslotID, dates); // YYYY-MM-DD
    deleteUnavailability(timeslotID, dates); // YYYY-MM-DD
    navigate("/timeslot-success");
  };

  const handleConfirmationRV = () => {
    addRVBooking(timeslotID, userID, dates);
    navigate("/timeslot-success");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleBookingCancel = () => {
    deleteRVBooking(timeslotID, userID, dates);
    navigate("/timeslot-success");
  };
  return (
    <Wrapper>
      <PopupDiv
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SurroundingBoxPopup>
          {userType === "admin" && (
            <div>
              <Warning src={warning} />
              <Header>Save changes?</Header>
              <Description>
                You are choosing to edit the availability of one or more time
                slots. Are you sure you want to do this?
              </Description>
              <Row>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <ConfirmButton onClick={handleConfirmationAdmin}>
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
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <ConfirmButton onClick={handleBookingCancel}>
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
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <ConfirmButton onClick={handleConfirmationRV}>
                  Book
                </ConfirmButton>
              </Row>
            </div>
          )}
        </SurroundingBoxPopup>
      </PopupDiv>
    </Wrapper>
  );
}
