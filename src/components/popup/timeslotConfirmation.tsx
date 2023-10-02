/* eslint-disable no-console */
import { useContext } from "react";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import UserContext from "../../userContext";
import { Booking, Timeslot } from "../../models";
import warning from "../../images/warning.svg";
import { CancelBtn, Description, Header, SaveBtn } from "../styledComponents";

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 40px;
  gap: 20px;
`;

const Warning = styled.img`
  position: relative;
  width: 80px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 90px;
`;

/**
 * This function takes a javascript Date object and converts it to a string in YYYY-MM-DD format
 * Input:
 *  - date: Date - The date object to be converted to YYYY-MM-DD format
 * Output:
 *  - retString: string - the string version of the date in YYYY-MM-DD format
 */
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

type TimeslotConfirmProps = {
  checkedLst: string[];
  uncheckedLst: string[];
  date: Date;
  riderDisabledLst: string[];
  toggleValue: string;
  setRiderDisabledLst: React.Dispatch<React.SetStateAction<string[]>>;
  handlePopupClose: () => void;
  handleSuccessOpen: () => void;
};

export default function TimeSlotConfirmation({
  checkedLst,
  uncheckedLst,
  date,
  toggleValue,
  riderDisabledLst,
  setRiderDisabledLst,
  handlePopupClose,
  handleSuccessOpen,
}: TimeslotConfirmProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;

  /**
   * This function checks whether the user is an admin and if so whether the action the admin is
   * initiating on this timeslot (enabling or disabling it) will cause it to be rider disabled. If
   * the admin is disabling at least one slot and the toggleValue = Riders or if the admin is
   * enabling at least one slot and the toggleValue = Volunteers then this will cause the slot to
   * become rider disabled so the function returns true. Additionally, if the riderDisabledLst has
   * something in it that means the admin has checked or unchecked a previously riderDisabled slot,
   * so it will return true regardless of the toggleValue.Otherwise it returns the riderDisabled
   * flag that is passed into this component, which will be true if the slot was previously rider
   * disabled at this time.
   * Input: none
   * Output:
   *  - Boolean, true if the interaction with this slot has something to do with rider disabling
   *    false if not.
   */
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

  /**
   * This function takes an array of timeslot ids and a date and for each one it queries the
   * Datastore to fetch that timeslot. It will then set that timeslot as disabled with a few
   * considerations:
   *  - If the current date is a sunday then the slot is disabled by default, so it will check
   *    if the slot has been added to the arrays availableSundays array, at which point it will
   *    filter it out of this array and send the updated timeslot back to the Datastore
   *  - If the toggleValue = Riders then the timeslot will only be disabled for riders, meaning
   *    the current date will be added to the riderUnavailableDates object
   *  - Otherwise, the date will be added to the users unavailableDates array, disabling it for
   *    both riders and volunteers.
   * Input:
   *  - ids: string[] - an array of the ids of the timeslots that are becoming unavailable
   *  - unavailableDate: Date - the date that the timeslots are being disabled for
   * Output: none
   */
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
          // If the date is Sunday then the slot is only enabled if it's in the availableSundays
          // array so remove the date from that
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
          }
          // If the toggleValue is set to Riders then disable the slot for riders only
          else if (toggleValue === "Riders") {
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
          }
          // If none of the other conditions were met then disable the slot normally
          else {
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

  /**
   * This function takes an array of timeslot ids and a date and for each one it queries the
   * Datastore to fetch that timeslot. It will then set that timeslot as enabled with a few
   * considerations:
   *  - If the timeslot is disabled and the admin tries to enable it with the Volunteers toggle
   *    selected then we only enable it for volunteers (disable it for riders)
   *  - If the timeslot is currently rider disabled then remove the date from the timeslot's
   *    riderUnavailableDates array and send update timeslot to datastore
   *  - If the current date is a sunday then the slot is disabled by default, so it will add the
   *    slot to the availableSundays array and send the updated timeslot back to the Datastore
   *  - Otherwise, the date will be removed from the users unavailableDates array, enabling it for
   *    both riders and volunteers.
   * Input:
   *  - timeslotId: string - the id of the timeslot that is becoming available
   *  - availableDate: Date - the date that the timeslot is being enabled for
   * Output: none
   */
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
          const updatedRiderList = new Set(original.riderUnavailableDates);
          // If the slot is not riderDisabled (meaning its disabled for everyone) and toggleValue =
          // Volunteers then only enable it for volunteers (rider disable the date).
          if (
            !updatedRiderList.has(convertedDate) &&
            toggleValue === "Volunteers"
          ) {
            updatedRiderList.add(convertedDate);
            await DataStore.save(
              Timeslot.copyOf(original, (updated) => {
                // eslint-disable-next-line no-param-reassign
                updated.riderUnavailableDates = Array.from(updatedRiderList);
              })
            );
          }
          // If the date is in the timeslot's riderUnavailableDates array then remove it
          else if (updatedRiderList.has(convertedDate)) {
            const updatedList = original.riderUnavailableDates.filter(
              (dateString) => convertedDate !== dateString
            );
            await DataStore.save(
              Timeslot.copyOf(original, (updated) => {
                updated.riderUnavailableDates = updatedList; // eslint-disable-line no-param-reassign
              })
            );
          }
          // If it's a sunday then add the date to the availableSundays array to enable it
          else if (
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
          }
          // If none of the other conditions are met then remove the date from the unavailableDates array
          else {
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

  /**
   * This function takes an array of timeslot ids and a date. It will check if the user is a
   * volunteer and if so it will loop through the timeslotIds and for each one create a new
   * booking for the user with that timeslot and on the entered date. If the user is a rider
   * It will create a new booking for the user with the first timeslot in the array as riders
   * aren't able to book more than one slot at a time.
   * Input:
   *  - addTimeslotIds: string[] - an array of the ids of the timeslots that are being booked
   *  - bookedDate: Date - the date that the timeslots are being booked on
   * Output: none
   */
  async function addRVBooking(addTimeslotIds: string[], bookedDate: Date) {
    try {
      if (userType === "Volunteer") {
        const tempDate = new Date(bookedDate);
        const formattedDate = convertToYMD(tempDate);
        const descriptionStr: string = `User: ${id} Booked Time: ${formattedDate}`;
        addTimeslotIds.forEach(async (addTimeslotId) => {
          const booking = new Booking({
            title: "New Booking -- Volunteer",
            date: formattedDate,
            description: descriptionStr,
            timeslotID: addTimeslotId,
            userID: id,
            userType,
          });
          await DataStore.save(booking);
        });
      } else if (userType === "Rider") {
        if (addTimeslotIds.length === 1) {
          const tempDate = new Date(bookedDate);
          const formattedDate = convertToYMD(tempDate);
          const descriptionStr: string = `User: ${id} Booked Time: ${formattedDate}`;
          const booking = new Booking({
            title: "New Booking -- Rider",
            date: formattedDate,
            description: descriptionStr,
            timeslotID: addTimeslotIds[0],
            userID: id,
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

  /**
   * This function takes an array of timeslot ids and for each one it deletes the user's bookings
   * on the currently selected date.
   * Input:
   *  - delTimeslotIds: string - the ids of the timeslots that are being unbooked
   * Output: none
   */
  async function deleteRVBooking(
    delTimeslotIds: string[] // which times they want to cancel
  ) {
    /*
    go through entire booking table, find the booking id that matches
    the timeslotid, and the date
     */
    try {
      delTimeslotIds.forEach(async (timeslotId) => {
        const bookings = await DataStore.query(Booking, (book) =>
          book.and((b) => [
            b.timeslotID.eq(timeslotId),
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

  /**
   * This function is run when the user clicks the Confirm button and the user is a admin. It first
   * calls handleSuccessOpen which will open the success popup, then if the uncheckedLst has
   * something in it then call addUnavailability with that list and the selected date. If the
   * checkedLst has something in it then call deleteUnavailability with that list and the selected
   * date.
   */
  const handleConfirmationAdmin = () => {
    handleSuccessOpen();
    if (uncheckedLst.length !== 0) {
      addUnavailability(uncheckedLst, date);
    }
    if (checkedLst.length !== 0) {
      deleteUnavailability(checkedLst, date);
    }
  };

  /**
   * This function is run when the user clicks the Confirm button and the user is a rider/volunteer.
   * It first calls handleSuccessOpen which will open the success popup, then if the checkedLst has
   * something in it then call addRVBooking with that list and the selected date. If the uncheckedLst
   * has something in it then call deleteRVBooking with that list and the selected date.
   */
  const handleConfirmationRV = () => {
    handleSuccessOpen();
    if (checkedLst.length !== 0) {
      addRVBooking(checkedLst, date);
    }
    if (uncheckedLst.length !== 0) {
      deleteRVBooking(uncheckedLst);
    }
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
            <CancelBtn onClick={handlePopupClose}>Cancel</CancelBtn>
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
            <CancelBtn onClick={handlePopupClose}>Cancel</CancelBtn>
            <SaveBtn onClick={handleConfirmationRV}>Confirm</SaveBtn>
          </BtnContainer>
        </Wrapper>
      )}
    </div>
  );
}
