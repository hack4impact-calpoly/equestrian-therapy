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
  padding: 7%;
  width: 100%;
  height: 400px;
`;

interface MobileTimeslotsProps {
  timeslots: LazyTimeslot[];
  date: Date;
  toggleValue: string;
  setTs: React.Dispatch<React.SetStateAction<LazyTimeslot[]>>;
}

interface TempTimeslot {
  startTime: string;
  endTime: string;
  backgroundColor: string;
  textColor: string;
  checked: boolean;
  enabled: boolean;
  timeslotId: string;
}

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

export default function MobileTimeslots({
  timeslots,
  date,
  toggleValue,
  setTs,
}: MobileTimeslotsProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType, id: currentUserId } = realUser;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requery, setRequery] = useState(true); // indicates whether the bookings need to be requeried from the server

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingModels = await DataStore.query(Booking);
        const ts = await DataStore.query(Timeslot);
        setBookings(bookingModels);
        setTs(ts);
        setRequery(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [requery]);

  function mapTimeslotColors(timeslot: LazyTimeslot) {
    let backgroundColor = "#90BFCC";
    let enabled = true;
    let checked = false;
    // If date is a Sunday, check the availableSundays (Sundays disabled on default)
    if (date.getDay() === 0) {
      if (userType === "Admin") {
        backgroundColor = "#C1C1C1";
      }
      enabled = false;
      if (
        timeslot.availableSundays &&
        timeslot.availableSundays.includes(convertToYMD(date))
      ) {
        if (userType === "Admin") {
          backgroundColor = "#90BFCC";
        }
        enabled = true;
      } // Non-Sunday dates check unavailableDates
    } else if (
      timeslot.unavailableDates &&
      timeslot.unavailableDates.includes(convertToYMD(date))
    ) {
      if (userType === "Admin") {
        backgroundColor = "#C1C1C1";
      } else {
        enabled = false;
      }
    }
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

    // if (
    //   timeslot.unavailableDates &&
    //   timeslot.unavailableDates.includes(convertToYMD(date))
    // ) {
    //   if (userType === "Admin") {
    //     backgroundColor = "#C1C1C1";
    //   }
    //   enabled = false;
    // }
    return {
      startTime: String(timeslot.startTime),
      endTime: String(timeslot.endTime),
      backgroundColor,
      textColor: "black",
      checked,
      enabled,
      timeslotId: timeslot.id,
    };
  }

  function filterTimeSlots(timeslot: TempTimeslot) {
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
    if (toggleValue === "Riders" || userType === "Rider") {
      return (
        Number(timeslot.startTime.substring(0, 2)) >= 10 &&
        Number(timeslot.startTime.substring(0, 2)) < 14 &&
        timeslot.enabled &&
        date.getDay() !== 0
      );
    }
    if (userType === "Admin") {
      return true;
    }
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
            startTime={timeslot.startTime}
            endTime={timeslot.endTime}
            date={date}
            backgroundColor={timeslot.backgroundColor}
            tId={timeslot.timeslotId}
            checked={timeslot.checked}
            enabled={timeslot.enabled}
            allBookings={bookings}
            setRequery={setRequery}
            toggleValue={toggleValue}
          />
        ))}
    </Slots>
  );
}
