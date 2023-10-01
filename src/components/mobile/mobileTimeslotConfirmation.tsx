/* eslint-disable no-console */
import { useContext } from "react";
import styled from "styled-components";
import { DataStore } from "aws-amplify";
import UserContext from "../../userContext";
import { Booking, Timeslot } from "../../models";
import warning from "../../images/warning.svg";
import {
  CancelBtn,
  CenteredDescription,
  CenteredHeader,
  SaveBtn,
} from "../styledComponents";

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
    padding: 0;
    width: 100%;
  }
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

const Warning = styled.img`
  width: 80px;
  margin-left: auto;
  margin-right: auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6%;
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

type MobileTimeSlotConfirmationProps = {
  timeslotId: string;
  allBookings: Booking[];
  checked: boolean;
  date: Date;
  riderDisabled: boolean;
  toggleValue: string;
  handleCancelled: () => void;
  handleClicked: () => void;
  setRequery: (requery: boolean) => void;
};

export default function MobileTimeSlotConfirmation({
  timeslotId,
  allBookings,
  checked,
  date,
  riderDisabled,
  toggleValue,
  handleCancelled,
  handleClicked,
  setRequery,
}: MobileTimeSlotConfirmationProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id } = realUser;

  /**
   * This function checks whether the user is an admin and if so whether the action the admin is
   * initiating on this timeslot (enabling or disabling it) will cause it to be rider disabled. If
   * the slot is already enabled and the toggleValue = Riders or if its disabled and the toggleValue
   * = Volunteers then this will cause the slot to become rider disabled so the function returns
   * true, otherwise it returns the riderDisabled flag that is passed into this component, which
   * will be true if the slot was previously rider disabled at this time.
   * Input: none
   * Output:
   *  - Boolean, true if the interaction with this slot has something to do with rider disabling
   *    false if not.
   */
  function checkRiderDisabling() {
    if (
      userType === "Admin" &&
      ((checked && toggleValue === "Riders") ||
        (!checked && toggleValue === "Volunteers"))
    ) {
      return true;
    }
    return riderDisabled;
  }

  /**
   * This function takes timeslot id and a date and queries the Datastore to fetch that timeslot
   * It will then set that timeslot as disabled with a few considerations:
   *  - If the current date is a sunday then the slot is disabled by default, so it will check
   *    if the slot has been added to the arrays availableSundays array, at which point it will
   *    filter it out of this array and send the updated timeslot back to the Datastore
   *  - If the toggleValue = Riders then the timeslot will only be disabled for riders, meaning
   *    the current date will be added to the riderUnavailableDates object
   *  - Otherwise, the date will be added to the users unavailableDates array, disabling it for
   *    both riders and volunteers.
   * Input:
   *  - timeslotId: string - the id of the timeslot that is becoming unavailable
   *  - unavailableDate: Date - the date that the timeslot is being disabled for
   * Output: none
   */
  async function addUnavailability(
    addTimeslotId: string,
    unavailableDate: Date
  ) {
    try {
      const original = await DataStore.query(Timeslot, addTimeslotId);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  /**
   * This function takes timeslot id and a date and queries the Datastore to fetch that timeslot
   * It will then set that timeslot as enabled with a few considerations:
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
  async function deleteUnavailability(
    delTimeslotId: string,
    availableDate: Date
  ) {
    try {
      const original = await DataStore.query(Timeslot, delTimeslotId);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("An error occurred: ", error.message); // eslint-disable-line no-console
      }
    }
  }

  /**
   * This function takes timeslot id and a date and creates a new booking for that user if they are
   * a volunteer or rider on that date and saves it to the DataStore
   * Input:
   *  - addTimeslotId: string - the id of the timeslot that is becoming available
   *  - bookedDate: Date - the date that the timeslot is being booked on
   * Output: none
   */
  async function addRVBooking(addTimeslotId: string, bookedDate: Date) {
    try {
      if (userType === "Volunteer" || userType === "Rider") {
        const tempDate = new Date(bookedDate);
        const formattedDate = convertToYMD(tempDate);
        const descriptionStr: string = `User: ${id} Booked Time: ${formattedDate}`;
        const booking = new Booking({
          title: `New Booking -- ${userType}`,
          date: formattedDate,
          description: descriptionStr,
          timeslotID: addTimeslotId,
          userID: id,
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

  /**
   * This function takes a timeslot id and deletes the user's bookings on the currently selected date
   * Input:
   *  - delTimeslotID: string - the id of the timeslot that is being unbooked
   * Output: none
   */
  async function deleteRVBooking(
    delTimeslotId: string // which time they want to cancel
  ) {
    try {
      // Go through entire booking table, find the booking id that matches the timeslotid, and the date
      const bookings = await DataStore.query(Booking, (book) =>
        book.and((b) => [
          b.timeslotID.eq(delTimeslotId),
          b.date.eq(convertToYMD(date)),
        ])
      );
      // For every booking found at the timeslot & date, delete it from the DataStore
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

  /**
   * This function is run when the user clicks the Confirm button and the user is an Admin. If the
   * slot is booked then call addUnavailability to disable it, if its currently disabled then call
   * deleteUnavailability to enable it. Then set the requery useState variable to true to update
   * the coloring on the timeslots
   */
  const handleConfirmationAdmin = () => {
    handleClicked();
    if (!checked) {
      deleteUnavailability(timeslotId, date); // YYYY-MM-DD
    } else {
      addUnavailability(timeslotId, date); // YYYY-MM-DD
    }
    setRequery(true);
  };

  /**
   * This function is run when the user clicks the Confirm button and the user is an Admin. If the
   * timeslot is booked already then call deleteRVBooking to unbook it. Otherwise, if the user is a
   * rider and there's anotherbooking on that date then return without doing anything. If not then
   * book the timeslot and set the requery useState variable to true to update the coloring on the
   * timeslots
   */
  const handleConfirmationRV = () => {
    handleClicked();
    if (checked) {
      deleteRVBooking(timeslotId);
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
      addRVBooking(timeslotId, date);
    }
    setRequery(true);
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
                {checkRiderDisabling() ? (
                  <span style={{ fontWeight: "bold" }}> rider</span>
                ) : (
                  " the"
                )}{" "}
                availability of one or more time slots. Are you sure you want to
                do this?
              </p>
            </CenteredDescription>
            <BtnContainer>
              <MobileCancelBtn onClick={handleCancelled}>
                Cancel
              </MobileCancelBtn>
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
              {`Confirm ${checked ? "cancellation" : "booking"}?`}
            </CenteredHeader>
            <CenteredDescription>
              {`You are choosing to ${
                checked ? "cancel" : "book"
              } a time slot. Are you sure you want to do this?`}
            </CenteredDescription>
            <BtnContainer>
              <MobileCancelBtn onClick={handleCancelled}>
                Cancel
              </MobileCancelBtn>
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
