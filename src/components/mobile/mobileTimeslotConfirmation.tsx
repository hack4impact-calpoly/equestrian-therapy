/* eslint-disable no-console */
import { useContext } from "react";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import UserContext from "../../userContext";
import { User, Booking } from "../../models";
import warning from "../../images/warning.svg";
import {
  CancelBtn,
  SaveBtn,
  CenteredDescription,
  CenteredHeader,
} from "../styledComponents";

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

interface MobileTimeSlotConfirmationProps {
  handleClicked: () => void;
  handleCancelled: () => void;
  booked: boolean;
  date: Date;
  tId: string;
  setRequery: (requery: boolean) => void;
}

export default function MobileTimeSlotConfirmation({
  handleClicked,
  handleCancelled,
  booked,
  date,
  tId,
  setRequery,
}: MobileTimeSlotConfirmationProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;

  async function addRVBooking(
    TimeslotID: string,
    userID: string,
    bookedDate: Date
  ) {
    try {
      console.log("THE DATE SELECTED IS", bookedDate);
      const original = await DataStore.query(User, userID);
      if (
        original &&
        (original.userType === "Volunteer" || original.userType === "Rider")
      ) {
        const tempDate = new Date(bookedDate);
        const formattedDate = convertToYMD(tempDate);
        const descriptionStr: string = `User: ${userID} Booked Time: ${formattedDate}`;
        const booking = new Booking({
          title: `New Booking -- ${original.userType}`,
          date: formattedDate,
          description: descriptionStr,
          timeslotID: TimeslotID,
          userID,
          userType,
        });
        await DataStore.save(booking);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  async function deleteRVBooking(
    TimeslotID: string // which time they want to cancel
  ) {
    /*
    go through entire booking table, find the booking id that matches
    the timeslotid, and the date
     */
    try {
      const bookings = await DataStore.query(Booking, (book) =>
        book.and((b) => [
          b.timeslotID.eq(TimeslotID),
          b.date.eq(convertToYMD(date)),
        ])
      );
      bookings.forEach((booking) => {
        DataStore.delete(booking);
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  const handleConfirmationAdmin = () => {
    handleClicked();
    // addUnavailability(uncheckedLst, date); // YYYY-MM-DD
    // deleteUnavailability(checkedLst, date); // YYYY-MM-DD
  };

  const handleConfirmationRV = () => {
    handleClicked();
    if (booked) {
      deleteRVBooking(tId);
      console.log("booked");
    } else {
      addRVBooking(tId, id, date);
      console.log("unbooked");
    }
    setRequery(true);
  };

  const handleCancel = () => {
    handleCancelled();
  };

  return (
    <div>
      {userType === "Admin" ? (
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
      ) : (
        <Wrapper>
          <Box>
            <Warning src={warning} />
            <CenteredHeader>
              {`Confirm ${booked ? "cancellation" : "booking"}?`}
            </CenteredHeader>
            <CenteredDescription>
              {`You are choosing to ${
                booked ? "cancel" : "book"
              } one or more time slots. Are you sure you want to do this?`}
            </CenteredDescription>
            <BtnContainer>
              <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
              <SaveBtn onClick={handleConfirmationRV}>Confirm</SaveBtn>
            </BtnContainer>
          </Box>
        </Wrapper>
      )}
    </div>
  );
}
