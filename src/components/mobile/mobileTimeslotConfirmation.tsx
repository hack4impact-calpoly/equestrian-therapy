/* eslint-disable no-console */
import { useContext } from "react";
import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
import { DataStore } from "aws-amplify";
import UserContext from "../../userContext";
// import { checkedLst, uncheckedLst } from "./timeslot";
import { User, Booking } from "../../models";
import warning from "../../images/warning.svg";
import {
  //   Box,
  CancelBtn,
  SaveBtn,
  CenteredDescription,
  CenteredHeader,
  //   Wrapper,
} from "../styledComponents";

export type TimeSlotProps = {
  handleClicked: () => void;
  handleCancelled: () => void;
  status: String;
  date: Date;
  tId: string;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4%;
`;

const Box = styled.section`
  border: solid 0.5px #c4c4c4;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  font-family: "Rubik", sans-serif;
  background: white;
  width: 35%;
  height: 380px;
  padding: 3rem 5rem;

  @media (max-width: 500px) {
    border: none;
    box-shadow: none;
    display: flex;
    // margin-top: 30%;
    padding: 0;
    width: 100%;
  }
`;

const Warning = styled.img`
  //   position: center;
  width: 80px;
  margin-left: auto;
  margin-right: auto;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 40px;
  gap: 20px;
`;

// async function addUnavailability(ids: string[], unavailableDate: Date) {
//   try {
//     ids.forEach(async (id) => {
//       const original = await DataStore.query(Timeslot, id);
//       if (
//         original !== null &&
//         original !== undefined &&
//         Array.isArray(original.unavailableDates)
//       ) {
//         const isoDate = new Date(unavailableDate).toISOString().split("T")[0];
//         const updatedList = new Set(original.unavailableDates);
//         if (!updatedList.has(isoDate)) {
//           updatedList.add(isoDate);
//           await DataStore.save(
//             Timeslot.copyOf(original, (updated) => {
//               // eslint-disable-next-line no-param-reassign
//               updated.unavailableDates = Array.from(updatedList);
//             })
//           );
//         }
//       }
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.log("An error occurred: ", error.message); // eslint-disable-line no-console
//     }
//   }
// }

// async function deleteUnavailability(ids: string[], availableDate: Date) {
//   try {
//     ids.forEach(async (id) => {
//       const original = await DataStore.query(Timeslot, id);
//       if (original && Array.isArray(original.unavailableDates)) {
//         const date = new Date(availableDate).toISOString().split("T")[0];

//         const updatedList = original.unavailableDates.filter((dateString) => {
//           if (dateString !== null) {
//             const isoDate = new Date(dateString).toISOString().split("T")[0];
//             return date !== isoDate;
//           }
//           return false;
//         });

//         await DataStore.save(
//           Timeslot.copyOf(original, (updated) => {
//             updated.unavailableDates = updatedList; // eslint-disable-line no-param-reassign
//           })
//         );
//       }
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.log("An error occurred: ", error.message); // eslint-disable-line no-console
//     }
//   }
// }

async function addRVBooking(
  TimeslotID: string,
  userID: string,
  bookedDate: Date
) {
  try {
    console.log("THE DATE SELECTED IS", bookedDate);
    const original = await DataStore.query(User, userID);
    if (
      original !== null &&
      original !== undefined &&
      (original.userType === "Volunteer" || original.userType === "Rider")
    ) {
      console.log("THE DATE SELECTED IS", bookedDate);
      const tempDate = new Date(bookedDate).toLocaleDateString();
      const formattedDate = `${tempDate.split("/")[2]}-0${
        tempDate.split("/")[0]
      }-${tempDate.split("/")[1]}`;
      console.log("THE DATE SELECTED IS", bookedDate);
      const descriptionStr: string = `User: ${userID} Booked Time: ${formattedDate}`;
      console.log("THE formatted DATE IS", formattedDate);
      const booking = new Booking({
        title: `New Booking -- ${original.userType}`,
        date: formattedDate,
        description: descriptionStr,
        timeslotID: TimeslotID,
        userID,
      });
      await DataStore.save(booking);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("An error occurred: ", error.message); // eslint-disable-line no-console
    }
  }
}

// async function deleteRVBooking(
//   TimeslotIDs: string[], // which time they want to cancel
//   userID: string
// ) {
//   console.log(TimeslotIDs);
//   console.log(userID);
// }
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

export default function MobileTimeSlotConfirmation({
  handleClicked,
  handleCancelled,
  status = "",
  date,
  tId,
}: TimeSlotProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;

  const handleConfirmationAdmin = () => {
    handleClicked();
    // addUnavailability(uncheckedLst, date); // YYYY-MM-DD
    // deleteUnavailability(checkedLst, date); // YYYY-MM-DD
  };

  const handleConfirmationRV = () => {
    handleClicked();
    addRVBooking(tId, id, date);
  };

  const handleCancel = () => {
    handleCancelled();
  };

  const handleBookingCancel = () => {
    // deleteRVBooking(uncheckedLst, id);
  };

  return (
    <div>
      {userType === "admin" && (
        <Wrapper>
          <Box>
            <Warning src={warning} />
            <CenteredHeader>Save changes?</CenteredHeader>
            <CenteredDescription>
              You are choosing to edit the availability of one or more time
              slots. Are you sure you want to do this?
            </CenteredDescription>
            <BtnContainer>
              <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
              <SaveBtn onClick={handleConfirmationAdmin}>Confirm</SaveBtn>
            </BtnContainer>
          </Box>
        </Wrapper>
      )}
      {userType !== "Admin" && status === "cancel" && (
        <Wrapper>
          <Box>
            <Warning src={warning} />
            <CenteredHeader>Confirm cancellation?</CenteredHeader>
            <CenteredDescription>
              You are choosing to cancel one or more time slots. Are you sure
              you want to do this?
            </CenteredDescription>
            <BtnContainer>
              <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
              <SaveBtn onClick={handleBookingCancel}>Confirm</SaveBtn>
            </BtnContainer>
          </Box>
        </Wrapper>
      )}
      {userType !== "admin" && tId && (
        <Wrapper>
          <Box>
            <Warning src={warning} />
            <CenteredHeader>Confirm booking?</CenteredHeader>
            <CenteredDescription>
              You are choosing to book this timeslot. Are you sure you want to
              do this?
            </CenteredDescription>
            <BtnContainer>
              <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
              <SaveBtn onClick={handleConfirmationRV}>Book</SaveBtn>
            </BtnContainer>
          </Box>
        </Wrapper>
      )}
    </div>
  );
}