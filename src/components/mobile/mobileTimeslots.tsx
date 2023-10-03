/* eslint-disable no-console */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { DataStore } from "@aws-amplify/datastore";
import UserContext from "../../userContext";
import MobileTimeslot from "./mobileTimeslot";
import { Booking, Timeslot, LazyTimeslot } from "../../models";

const Slots = styled.section`
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 7%;
  padding-right: 7%;
  padding-top: 2%;
  width: 100%;
  height: 400px;
`;

interface TempTimeslot {
  timeslotId: string;
  startTime: string;
  endTime: string;
  backgroundColor: string;
  checked: boolean;
  enabled: boolean;
}

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

type MobileTimeslotsProps = {
  date: Date;
  toggleValue: string;
  timeslots: LazyTimeslot[];
  setTimeslots: React.Dispatch<React.SetStateAction<LazyTimeslot[]>>;
};

export default function MobileTimeslots({
  date,
  toggleValue,
  timeslots,
  setTimeslots,
}: MobileTimeslotsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requery, setRequery] = useState(true); // indicates whether the bookings need to be requeried from the server

  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id: currentUserId } = realUser;

  /**
   * This useEffect is run everytime the requery useState variable is updated. requery will be set
   * to true if the user makes a booking or edits the availability of a timeslot. It will refetch
   * the bookings and timeslots so the new change is reflected to the user immediatly (such as the
   * color)
   */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch both the bookings and timeslots from the Datastore
        const bookingModels = await DataStore.query(Booking);
        const ts = await DataStore.query(Timeslot);
        // Set the updated bookings and timeslots to their useState variables and tuen off requery
        setBookings(bookingModels);
        setTimeslots(ts);
        setRequery(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [requery]);

  /**
   * This function takes a timeslot as input and transforms it into all of the information needed
   * to render the timeslot in the mobileTimeslots array to the user
   * Input:
   *  - timeslot: LazyTimeslot - a timeslot fetched from the dataStore
   * Output:
   *  - A Temp timeslot with the following fields:
   *      timeslotId: string - the id of the timeslot, from the DataStore
   *      startTime: string - the startTime of the timeslot, from the DataStore
   *      endTime: string - the endTime of the timeslot, from the Datastore
   *      backgroundColor: string - the hexcode of the background color of the rendered
   *                       MobileTimeslot, will be blue by default, light blue/grey if booked,
   *                       dark blue if rider disabled and the user is an admin, or dark grey
   *                       if the slot is disabled and the user is an admin.
   *      checked: boolean - whether or not the timeslot is checked, for volunteers and riders
   *               timeslots are checked if the current user has a booking for that timeslot on
   *               that date, for admins whether or not a timeslot is checked depends on if it's
   *               enabled, as outlined below.
   *      enabled: boolean - whether or not the timeslot is enabled, timeslots are enabled by
   *               default except for on sundays, at which point they need to be enabled by being
   *               added to the availableSundays array
   *      riderDisabled: boolean - whether or not the timeslot is riderDisabled, from the DataStore
   */
  function mapTimeslotColors(timeslot: LazyTimeslot) {
    let backgroundColor = "#90BFCC";
    let enabled = true;
    let checked = false;
    if (userType === "Admin") {
      checked = true;
    }
    let riderDisabled = false;

    // If date is a Sunday, disabled the slot by default, if admin set background color to dark grey
    if (date.getDay() === 0) {
      if (userType === "Admin") {
        backgroundColor = "#C1C1C1";
      }
      checked = false;
      enabled = false;
      // If current sunday is enabled then re-enable the slot, for admin check it and reset color
      if (
        timeslot.availableSundays &&
        timeslot.availableSundays.includes(convertToYMD(date))
      ) {
        if (userType === "Admin") {
          backgroundColor = "#90BFCC";
          checked = true;
        }
        enabled = true;
      }
    }
    // Non-Sunday dates check unavailableDates, then set enabled to false (or uncheck and dark grey
    // for admins)
    else if (
      timeslot.unavailableDates &&
      timeslot.unavailableDates.includes(convertToYMD(date))
    ) {
      if (userType === "Admin") {
        backgroundColor = "#C1C1C1";
        checked = false;
      } else {
        enabled = false;
      }
    }
    // If the timeslot is rider disabled then set riderDisabled to true, disable it for riders,
    // set the color to dark blue & uncheck it for admin, enable for volunteer
    if (
      timeslot.riderUnavailableDates &&
      timeslot.riderUnavailableDates.includes(convertToYMD(date))
    ) {
      riderDisabled = true;
      if (userType === "Rider") {
        enabled = false;
      } else if (userType === "Admin") {
        backgroundColor = "#708BDB";
        checked = false;
      } else {
        enabled = true;
      }
    }
    /**
     * The following gross if statement is to determine if the timeslot has a booking or not on
     * this date. If there is a booking for this slot then change the backround color to light grey.
     * The conditions for when you would want to color a timeslot are as follows:
     *  - If the user is a Rider or the user is an Admin with the Riders toggle selected and the
     *    timeslot has a booking from a Rider (doesn't have to be the current user)
     *  - If the user is an Admin with the Both toggle selected or the user is a Volunteer and there
     *    is a booking from any other user
     *  - If the user is an Admin with the Volunteers toggle selected and there is a booking from any
     *    Volunteer
     * If one of these conditions passes then run an additional check to see if the booking is by the
     * current user, if so set checked to true if the user isn't an admin.
     */
    if (
      ((userType === "Rider" || toggleValue === "Riders") &&
        bookings.some(
          (booking) =>
            booking.timeslotID === timeslot.id &&
            date.getDate() ===
              Number(
                String(booking.date).substring(
                  String(booking.date).length - 2,
                  String(booking.date).length
                )
              ) &&
            date.getMonth() + 1 ===
              Number(String(booking.date).substring(5, 7)) &&
            date.getFullYear() ===
              Number(String(booking.date).substring(0, 4)) &&
            booking.userType === "Rider"
        )) ||
      ((toggleValue === "Both" ||
        (userType === "Admin" &&
          toggleValue !== "Riders" &&
          toggleValue !== "Volunteers") ||
        userType === "Volunteer") &&
        bookings.some(
          (booking) =>
            booking.timeslotID === timeslot.id &&
            date.getDate() ===
              Number(
                String(booking.date).substring(
                  String(booking.date).length - 2,
                  String(booking.date).length
                )
              ) &&
            date.getMonth() + 1 ===
              Number(String(booking.date).substring(5, 7)) &&
            date.getFullYear() === Number(String(booking.date).substring(0, 4))
        )) ||
      (userType === "Admin" &&
        toggleValue === "Volunteers" &&
        bookings.some(
          (booking) =>
            booking.timeslotID === timeslot.id &&
            date.getDate() ===
              Number(
                String(booking.date).substring(
                  String(booking.date).length - 2,
                  String(booking.date).length
                )
              ) &&
            date.getMonth() + 1 ===
              Number(String(booking.date).substring(5, 7)) &&
            date.getFullYear() ===
              Number(String(booking.date).substring(0, 4)) &&
            booking.userType === "Volunteer"
        ))
    ) {
      backgroundColor = "#E0EFF1";

      // If the current user has a booking at this time and isn't an admin, set checked to true
      if (
        userType !== "Admin" &&
        bookings.some(
          (booking) =>
            booking.timeslotID === timeslot.id &&
            date.getDate() ===
              Number(
                String(booking.date).substring(
                  String(booking.date).length - 2,
                  String(booking.date).length
                )
              ) &&
            date.getMonth() + 1 ===
              Number(String(booking.date).substring(5, 7)) &&
            date.getFullYear() ===
              Number(String(booking.date).substring(0, 4)) &&
            booking.userID === currentUserId
        )
      )
        checked = true;
    }

    return {
      timeslotId: timeslot.id,
      startTime: String(timeslot.startTime),
      endTime: String(timeslot.endTime),
      backgroundColor,
      checked,
      enabled,
      riderDisabled,
    };
  }

  /**
   * This function is run after the timeslots are mapped to TempTimeslots, it will filter the
   * timeslots based on the current toggle and whether it's enabled. If the toggle is on "My
   * Slots" then only show timeslots that the user has booked. If the user is a Rider or the
   * user is an Admin and has the Riders toggle selected then only show slots between 10am and
   * 2pm. Otherwise, if the user isn't an admin then only show the enabled slots
   */
  function filterTimeSlots(timeslot: TempTimeslot) {
    // If My Slots is the toggle then only show slots the user has booked
    if (toggleValue === "My Slots") {
      return (
        bookings.some(
          (booking) =>
            booking.userID === currentUserId &&
            booking.timeslotID === timeslot.timeslotId &&
            booking.date === convertToYMD(date)
        ) && timeslot.enabled
      );
    }
    // If the user is a Rider or the toggle is Riders then only show slots between 10am and 2pm
    if (toggleValue === "Riders" || userType === "Rider") {
      return (
        Number(timeslot.startTime.substring(0, 2)) >= 10 &&
        Number(timeslot.startTime.substring(0, 2)) < 14 &&
        timeslot.enabled
      );
    }
    // If the user is an Admin we don't want to filter out the disabled slots
    if (userType === "Admin") {
      return true;
    }
    // Only return slots that are enabled
    return timeslot.enabled;
  }

  return (
    <Slots>
      {timeslots
        .map((timeslot) => mapTimeslotColors(timeslot))
        .filter((timeslot) => filterTimeSlots(timeslot))
        .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
        .map((timeslot, i) => (
          <MobileTimeslot // eslint-disable-next-line react/no-array-index-key
            key={i}
            timeslotId={timeslot.timeslotId}
            startTime={timeslot.startTime}
            endTime={timeslot.endTime}
            allBookings={bookings}
            backgroundColor={timeslot.backgroundColor}
            checked={timeslot.checked}
            date={date}
            enabled={timeslot.enabled}
            riderDisabled={timeslot.riderDisabled}
            toggleValue={toggleValue}
            setRequery={setRequery}
          />
        ))}
    </Slots>
  );
}
