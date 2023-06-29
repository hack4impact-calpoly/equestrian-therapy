/* eslint-disable no-console */
import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
import { DataStore } from "aws-amplify";
import UserContext from "../../userContext";
import { checkedLst, uncheckedLst } from "./timeslot";
import {
  Timeslot,
  User,
  Booking,
  LazyTimeslot,
  LazyBooking,
} from "../../models";
import warning from "../../images/warning.svg";
import { CancelBtn, SaveBtn, Description, Header } from "../styledComponents";

export type TimeSlotProps = {
  handleClicked: () => void;
  handleCancelled: () => void;
  status: String;
  date: Date;
  setTs: React.Dispatch<React.SetStateAction<LazyTimeslot[]>>;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 90px;
`;

const Warning = styled.img`
  position: relative;
  width: 80px;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 40px;
  gap: 20px;
`;

function convertToYMD(date: Date) {
  const localString = date.toLocaleDateString();
  const splitDate = localString.split("/");
  let retString = `${localString.split("/")[2]}-`;

  if (splitDate[0].length === 1) {
    retString += `0`;
  }
  retString += `${localString.split("/")[0]}-`;
  if (splitDate[1].length === 1) {
    retString += `0`;
  }
  retString += `${localString.split("/")[1]}`;
  return retString;
}

export default function TimeSlotConfirmation({
  handleClicked,
  handleCancelled,
  status = "",
  date,
  setTs,
}: TimeSlotProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;
  const [newBooking, setNewBooking] = useState<LazyBooking>();

  useEffect(() => {
    const pullData = async () => {
      const ts = await DataStore.query(Timeslot);
      console.log("pulled timeslots");
      setTs(ts);
    };
    pullData();
  }, [newBooking]);

  async function addUnavailability(ids: string[], unavailableDate: Date) {
    try {
      ids.forEach(async (userId) => {
        const original = await DataStore.query(Timeslot, userId);
        if (
          original !== null &&
          original !== undefined &&
          Array.isArray(original.unavailableDates)
        ) {
          const ymdDate = convertToYMD(new Date(unavailableDate));
          const updatedList = new Set(original.unavailableDates);
          if (!updatedList.has(ymdDate)) {
            updatedList.add(ymdDate);
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

  async function deleteUnavailability(ids: string[], availableDate: Date) {
    try {
      ids.forEach(async (userId) => {
        const original = await DataStore.query(Timeslot, userId);
        if (original && Array.isArray(original.unavailableDates)) {
          const convertedDate = convertToYMD(new Date(availableDate));

          const updatedList = original.unavailableDates.filter((dateString) => {
            if (dateString !== null) {
              const isoDate = convertToYMD(new Date(dateString));
              return convertedDate !== isoDate;
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
    bookedDate: Date
  ) {
    try {
      const original = await DataStore.query(User, userID);
      if (
        original !== null &&
        original !== undefined &&
        original.userType === "Volunteer"
      ) {
        const tempDate = new Date(bookedDate);
        const formattedDate = convertToYMD(tempDate);
        const descriptionStr: string = `User: ${userID} Booked Time: ${formattedDate}`;
        TimeslotIDs.forEach(async (TimeslotID) => {
          const booking = new Booking({
            title: "New Booking -- Volunteer",
            date: formattedDate,
            description: descriptionStr,
            timeslotID: TimeslotID,
            userID,
          });
          const booked = await DataStore.save(booking);
          setNewBooking(booked);
        });
      } else if (
        original !== null &&
        original !== undefined &&
        original.userType === "Rider"
      ) {
        if (TimeslotIDs.length === 1) {
          const tempDate = new Date(bookedDate);
          const formattedDate = convertToYMD(tempDate);
          const descriptionStr: string = `User: ${userID} Booked Time: ${formattedDate}`;
          const booking = new Booking({
            title: "New Booking -- Rider",
            date: formattedDate,
            description: descriptionStr,
            timeslotID: TimeslotIDs[0],
            userID,
          });
          const booked = await DataStore.save(booking);
          setNewBooking(booked);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  async function deleteRVBooking(
    TimeslotIDs: string[], // which time they want to cancel
    userID: string
  ) {
    console.log(TimeslotIDs);
    console.log(userID);
  }
  //   /*
  //   go through entire booking table, find the booking id that matches
  //   the timeslotid, and the date
  //    */
  //   try {
  //     const BookingTable = await DataStore.query(Booking);
  //     TimeslotIDs.forEach((TimeslotID) => {
  //       BookingTable.forEach((booking) => {
  //         if (booking.userID === userID && booking.timeslotID === TimeslotID) {
  //           DataStore.delete(booking);
  //         }
  //       });
  //     });
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.log("An error occurred: ", error.message); // eslint-disable-line no-console
  //     }
  //   }
  // }

  const handleConfirmationAdmin = () => {
    handleClicked();
    addUnavailability(uncheckedLst, date); // YYYY-MM-DD
    deleteUnavailability(checkedLst, date); // YYYY-MM-DD
  };

  const handleConfirmationRV = () => {
    handleClicked();
    addRVBooking(checkedLst, id, date);
  };

  const handleCancel = () => {
    handleCancelled();
  };

  const handleBookingCancel = () => {
    deleteRVBooking(uncheckedLst, id);
  };

  return (
    <div>
      {userType === "admin" && (
        <Wrapper>
          <Warning src={warning} />
          <Header>Save changes?</Header>
          <Description>
            You are choosing to edit the availability of one or more time slots.
            Are you sure you want to do this?
          </Description>
          <BtnContainer>
            <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
            <SaveBtn onClick={handleConfirmationAdmin}>Confirm</SaveBtn>
          </BtnContainer>
        </Wrapper>
      )}
      {userType !== "Admin" && status === "cancel" && (
        <Wrapper>
          <Warning src={warning} />
          <Header>Confirm cancellation?</Header>
          <Description>
            You are choosing to cancel one or more time slots. Are you sure you
            want to do this?
          </Description>
          <BtnContainer>
            <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
            <SaveBtn onClick={handleBookingCancel}>Confirm</SaveBtn>
          </BtnContainer>
        </Wrapper>
      )}
      {userType !== "admin" && checkedLst.length !== 0 && (
        <Wrapper>
          <Warning src={warning} />
          <Header>Confirm booking?</Header>
          <Description>
            You are choosing to book one or more time slots. Are you sure you
            want to do this?
          </Description>
          <BtnContainer>
            <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
            <SaveBtn onClick={handleConfirmationRV}>Book</SaveBtn>
          </BtnContainer>
        </Wrapper>
      )}
    </div>
  );
}
