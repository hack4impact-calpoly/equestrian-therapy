import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DataStore } from "aws-amplify";
import { Modal } from "@mui/material";
import warning from "../../images/warning.svg";
import { Timeslot, User, Booking } from "../../models";
import { checkedLst, uncheckedLst } from "./timeslot";
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
  userID: string;
  date: string;
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

async function addUnavailability(ids: string[], unavailableDate: string) {
  try {
    ids.forEach(async (id) => {
      const original = await DataStore.query(Timeslot, id);
      if (
        original !== null &&
        original !== undefined &&
        Array.isArray(original.unavailableDates)
      ) {
        const isoDate = new Date(unavailableDate).toISOString().split("T")[0];
        const updatedList = new Set(original.unavailableDates);
        if (!updatedList.has(isoDate)) {
          updatedList.add(isoDate);
          await DataStore.save(
            Timeslot.copyOf(original, (updated) => {
              // eslint-disable-next-line no-param-reassign
              updated.unavailableDates = Array.from(updatedList);
            })
          );
        }
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
}

async function deleteUnavailability(ids: string[], availableDate: string) {
  try {
    ids.forEach(async (id) => {
      const original = await DataStore.query(Timeslot, id);
      if (original && Array.isArray(original.unavailableDates)) {
        const date = new Date(availableDate).toISOString().split("T")[0];

        const updatedList = original.unavailableDates.filter((dateString) => {
          if (dateString !== null) {
            const isoDate = new Date(dateString).toISOString().split("T")[0];
            return date !== isoDate;
          }
          return false;
        });

        await DataStore.save(
          Timeslot.copyOf(original, (updated) => {
            updated.unavailableDates = updatedList; // eslint-disable-line no-param-reassign
          })
        );
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
}

async function addRVBooking(
  TimeslotIDs: string[],
  userID: string,
  bookedDate: string
) {
  try {
    const original = await DataStore.query(User, userID);
    if (
      original !== null &&
      original !== undefined &&
      original.userType === "Volunteer"
    ) {
      const isoDate = new Date(bookedDate).toISOString().split("T")[0];
      const descriptionStr: string = `User: ${userID} Booked Time: ${isoDate}`;
      TimeslotIDs.forEach(async (TimeslotID) => {
        const booking = new Booking({
          title: "New Booking -- Volunteer",
          date: isoDate,
          description: descriptionStr,
          timeslotID: TimeslotID,
          userID,
        });
        await DataStore.save(booking);
      });
    } else if (
      original !== null &&
      original !== undefined &&
      original.userType === "Rider"
    ) {
      if (TimeslotIDs.length === 1) {
        const isoDate = new Date(bookedDate).toISOString().split("T")[0];
        const descriptionStr: string = `User: ${userID} Booked Time: ${isoDate}`;
        const booking = new Booking({
          title: "New Booking -- Rider",
          date: isoDate,
          description: descriptionStr,
          timeslotID: TimeslotIDs[0],
          userID,
        });
        await DataStore.save(booking);
      }
    }
    console.log("this line", await DataStore.query(Booking));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
  console.log(await DataStore.query(Booking));
}

async function deleteRVBooking(
  TimeslotIDs: string[], // which time they want to cancel
  userID: string
) {
  /*
  go through entire booking table, find the booking id that matches
  the timeslotid, and the date
   */
  try {
    const BookingTable = await DataStore.query(Booking);
    TimeslotIDs.forEach((TimeslotID) => {
      BookingTable.forEach((booking) => {
        if (booking.userID === userID && booking.timeslotID === TimeslotID) {
          DataStore.delete(booking);
        }
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
}
export default function TimeSlotConfirmation({
  userType,
  userID,
  date,
}: TimeSlotProps) {
  const open = true;
  const navigate = useNavigate();

  const handleConfirmationAdmin = () => {
    addUnavailability(uncheckedLst, date); // YYYY-MM-DD
    deleteUnavailability(checkedLst, date); // YYYY-MM-DD
    navigate("/timeslot-success");
  };

  const handleConfirmationRV = () => {
    addRVBooking(checkedLst, userID, date);
    navigate("/timeslot-success");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleBookingCancel = () => {
    deleteRVBooking(uncheckedLst, userID);
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
          {userType !== "admin" && uncheckedLst.length !== 0 && (
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
          {userType !== "admin" && checkedLst.length !== 0 && (
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
