/* eslint-disable no-console */
import { useContext } from "react";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import UserContext from "../../userContext";
import { Timeslot, User, Booking } from "../../models";
import warning from "../../images/warning.svg";
import { CancelBtn, SaveBtn, Description, Header } from "../styledComponents";

export type TimeslotConfirmProps = {
  handleClicked: () => void;
  handleCancelled: () => void;
  date: Date;
  checkedLst: string[];
  uncheckedLst: string[];
  riderDisabledLst: string[];
  setRiderDisabledLst: React.Dispatch<React.SetStateAction<string[]>>;
  toggleValue: string;
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
  date,
  checkedLst,
  uncheckedLst,
  riderDisabledLst,
  setRiderDisabledLst,
  toggleValue,
}: TimeslotConfirmProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;

  function checkRiderDisabling() {
    if (
      userType === "Admin" &&
      ((uncheckedLst.length > 0 && toggleValue === "Riders") ||
        (checkedLst.length > 0 && toggleValue === "Volunteers"))
    ) {
      return true;
    }
    if (riderDisabledLst.length > 0) {
      return true;
    }
    return false;
  }

  async function addUnavailability(ids: string[], unavailableDate: Date) {
    try {
      setRiderDisabledLst([]);
      ids.forEach(async (timeslotId) => {
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
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  async function deleteUnavailability(ids: string[], availableDate: Date) {
    try {
      setRiderDisabledLst([]);
      ids.forEach(async (timeslotId) => {
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
            console.log(toggleValue);
          } else {
            console.log("why are we here");
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
      if (original && original.userType === "Volunteer") {
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
            userType,
          });
          await DataStore.save(booking);
        });
      } else if (original && original.userType === "Rider") {
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
            userType,
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
    TimeslotIDs: string[] // which time they want to cancel
  ) {
    /*
    go through entire booking table, find the booking id that matches
    the timeslotid, and the date
     */
    try {
      TimeslotIDs.forEach(async (TimeslotID) => {
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
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  const handleConfirmationAdmin = () => {
    handleClicked();
    if (uncheckedLst.length !== 0) {
      addUnavailability(uncheckedLst, date); // YYYY-MM-DD
    }
    if (checkedLst.length !== 0) {
      deleteUnavailability(checkedLst, date); // YYYY-MM-DD
    }
  };

  const handleConfirmationRV = () => {
    handleClicked();
    if (checkedLst.length !== 0) {
      addRVBooking(checkedLst, id, date);
    }
    if (uncheckedLst.length !== 0) {
      deleteRVBooking(uncheckedLst);
    }
  };

  const handleCancel = () => {
    handleCancelled();
  };

  return (
    <div>
      {userType === "Admin" ? (
        <Wrapper>
          <Warning src={warning} />
          <Header>Save changes?</Header>
          <Description>
            <p style={{ padding: 0, margin: 0 }}>
              You are choosing to edit
              {checkRiderDisabling() ? (
                <span style={{ fontWeight: "bold" }}> rider</span>
              ) : (
                " the"
              )}{" "}
              availability of one or more time slots. Are you sure you want to
              do this?
            </p>
          </Description>
          <BtnContainer>
            <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
            <SaveBtn onClick={handleConfirmationAdmin}>Confirm</SaveBtn>
          </BtnContainer>
        </Wrapper>
      ) : (
        <Wrapper>
          <Warning src={warning} />
          <Header>
            {`Confirm ${
              checkedLst.length < uncheckedLst.length
                ? "cancellation"
                : "booking"
            }?`}
          </Header>
          <Description>
            {`You are choosing to ${
              checkedLst.length < uncheckedLst.length ? "cancel" : "book"
            } one or more time slots. Are you sure you want to do this?`}
          </Description>
          <BtnContainer>
            <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
            <SaveBtn onClick={handleConfirmationRV}>Confirm</SaveBtn>
          </BtnContainer>
        </Wrapper>
      )}
    </div>
  );
}
