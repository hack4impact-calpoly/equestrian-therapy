/* eslint-disable no-console */
import { useContext } from "react";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import UserContext from "../../userContext";
import { User, Booking, Timeslot } from "../../models";
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
  padding: 6%;
`;

const Box = styled.div`
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

const MobileCancelBtn = styled(CancelBtn)`
  width: 50%;
`;

const MobileSaveBtn = styled(SaveBtn)`
  width: 50%;
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
  // enabled: boolean;
  date: Date;
  tId: string;
  riderDisabled: boolean;
  toggleValue: string;
  allBookings: Booking[];
  setRequery: (requery: boolean) => void;
}

export default function MobileTimeSlotConfirmation({
  handleClicked,
  handleCancelled,
  booked,
  // enabled,
  date,
  tId,
  riderDisabled,
  toggleValue,
  allBookings,
  setRequery,
}: MobileTimeSlotConfirmationProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;

  function tryThis() {
    if (
      userType === "Admin" &&
      ((booked && toggleValue === "Riders") ||
        (!booked && toggleValue === "Volunteers"))
    ) {
      return true;
    }
    return riderDisabled;
  }

  async function addUnavailability(timeslotId: string, unavailableDate: Date) {
    try {
      const original = await DataStore.query(Timeslot, timeslotId);
      if (
        original &&
        Array.isArray(original.unavailableDates) &&
        Array.isArray(original.availableSundays) &&
        Array.isArray(original.riderUnavailableDates)
      ) {
        const ymdDate = convertToYMD(new Date(unavailableDate));
        if (
          unavailableDate.getDay() === 0 &&
          original.availableSundays.includes(ymdDate)
        ) {
          const updatedList = original.availableSundays.filter(
            (dateString) => ymdDate !== dateString
          );
          await DataStore.save(
            Timeslot.copyOf(original, (updated) => {
              updated.availableSundays = updatedList; // eslint-disable-line no-param-reassign
            })
          );
        } else if (toggleValue === "Riders") {
          const updatedList = new Set(original.riderUnavailableDates);
          if (!updatedList.has(ymdDate)) {
            updatedList.add(ymdDate);
            await DataStore.save(
              Timeslot.copyOf(original, (updated) => {
                // eslint-disable-next-line no-param-reassign
                updated.riderUnavailableDates = Array.from(updatedList);
              })
            );
          }
        } else if (
          original.riderUnavailableDates &&
          original.riderUnavailableDates.includes(ymdDate)
        ) {
          console.log("HELLO???");
          const updatedList = original.riderUnavailableDates.filter(
            (dateString) => ymdDate !== dateString
          );
          await DataStore.save(
            Timeslot.copyOf(original, (updated) => {
              updated.riderUnavailableDates = updatedList; // eslint-disable-line no-param-reassign
            })
          );
        } else {
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
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  async function deleteUnavailability(timeslotId: string, availableDate: Date) {
    try {
      const original = await DataStore.query(Timeslot, timeslotId);
      const convertedDate = convertToYMD(new Date(availableDate));
      if (
        original &&
        Array.isArray(original.unavailableDates) &&
        Array.isArray(original.availableSundays) &&
        Array.isArray(original.riderUnavailableDates)
      ) {
        if (toggleValue === "Volunteers") {
          const updatedRiderList = new Set(original.riderUnavailableDates);
          if (!updatedRiderList.has(convertedDate)) {
            updatedRiderList.add(convertedDate);
            console.log("are you here?", updatedRiderList, original);
            await DataStore.save(
              Timeslot.copyOf(original, (updated) => {
                // eslint-disable-next-line no-param-reassign
                updated.riderUnavailableDates = Array.from(updatedRiderList);
              })
            );
          } else if (updatedRiderList.has(convertedDate)) {
            const updatedList = original.riderUnavailableDates.filter(
              (dateString) => convertedDate !== dateString
            );
            await DataStore.save(
              Timeslot.copyOf(original, (updated) => {
                updated.riderUnavailableDates = updatedList; // eslint-disable-line no-param-reassign
              })
            );
          }
        } else if (
          availableDate.getDay() === 0 &&
          (!Array.isArray(original.riderUnavailableDates) ||
            !original.riderUnavailableDates.includes(convertedDate))
        ) {
          const updatedList = new Set(original.availableSundays);
          if (!updatedList.has(convertedDate)) {
            updatedList.add(convertedDate);
            await DataStore.save(
              Timeslot.copyOf(original, (updated) => {
                // eslint-disable-next-line no-param-reassign
                updated.availableSundays = Array.from(updatedList);
              })
            );
          }
        } else {
          const updatedList = original.unavailableDates.filter(
            (dateString) => convertedDate !== dateString
          );
          await DataStore.save(
            Timeslot.copyOf(original, (updated) => {
              updated.unavailableDates = updatedList; // eslint-disable-line no-param-reassign
            })
          );
        }
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
        if (booking.userID === id) {
          DataStore.delete(booking);
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  const handleConfirmationAdmin = () => {
    handleClicked();
    console.log("AYO", booked);
    if (!booked) {
      deleteUnavailability(tId, date); // YYYY-MM-DD
      console.log("enabled");
    } else {
      addUnavailability(tId, date); // YYYY-MM-DD
      console.log("disabled");
    }
    setRequery(true);
  };

  const handleConfirmationRV = () => {
    handleClicked();
    if (booked) {
      deleteRVBooking(tId);
      console.log("booked");
    } else {
      if (
        userType === "Rider" &&
        allBookings.some(
          (booking) =>
            booking.date === convertToYMD(date) && booking.userID === id
        )
      ) {
        return;
      }
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
              <p style={{ padding: 0, margin: 0 }}>
                You are choosing to edit
                {tryThis() ? (
                  <span style={{ fontWeight: "bold" }}> rider</span>
                ) : (
                  " the"
                )}{" "}
                availability of one or more time slots. Are you sure you want to
                do this?
              </p>
            </CenteredDescription>
            <BtnContainer>
              <MobileCancelBtn onClick={handleCancel}>Cancel</MobileCancelBtn>
              <MobileSaveBtn onClick={handleConfirmationAdmin}>
                Confirm
              </MobileSaveBtn>
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
              } a time slot. Are you sure you want to do this?`}
            </CenteredDescription>
            <BtnContainer>
              <MobileCancelBtn onClick={handleCancel}>Cancel</MobileCancelBtn>
              <MobileSaveBtn onClick={handleConfirmationRV}>
                Confirm
              </MobileSaveBtn>
            </BtnContainer>
          </Box>
        </Wrapper>
      )}
    </div>
  );
}
