import { useState } from "react";
import styled from "styled-components";
import MobileTimeslot from "./mobileTimeslot";
import { LazyTimeslot } from "../../models";
import { timeslots } from "../booking";

// added height and margin-top and changed overflowy to overflow-y
const Slots = styled.section`
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 7%;
  margin-top: 10%;
  width: 100%;
  height: 400px;
`;

interface TimeslotsProps {
  // Update interface name to TimeslotsProps
  userType: "volunteer" | "rider" | "admin";
}

export default function MobileTimeslots({ userType }: TimeslotsProps) {
  const [filteredTimeslots, setTs] = useState<LazyTimeslot[]>([]);
  const updatedSlots = timeslots.map((timeslot: any) => {
    let backgroundColor = "#90BFCC";
    //let isBooked = false;
    let isBookedVolunteer = false;
    let isDisabled = false;
    let isBookedRider = false;
    // checks if rider or volunteer has booking at time or if admin disabled
    if (userType === "rider") {
      const hasRiderBooking = timeslot.riderBookings.length > 0;
      if (hasRiderBooking) {
        backgroundColor = "#E0EFF1";
        isBookedRider = true;
      }
    } else if (userType === "volunteer") {
      const hasVolunteerBooking = timeslot.volunteerBookings.length > 0;
      if (hasVolunteerBooking) {
        backgroundColor = "#E0EFF1";
        // console.log("hi");
        isBookedVolunteer = true;
      }
    } else if (userType === "admin") {
      if (
        timeslot.unavailableDates.includes(timeslot.startTime.toDateString())
      ) {
        backgroundColor = "#E0EFF1";
        isDisabled = true;
      }
    }
    return {
      startTime: timeslot.startTime,
      daysOfWeek: ["1", "2", "3", "4", "5"],
      endTime: timeslot.endTime,
      backgroundColor,
      textColor: "black",
      isBookedVolunteer,
      isBookedRider,
      isDisabled
    };
  });

  return (
    <Slots>
      {updatedSlots.map((booking: any) => (
        <MobileTimeslot
          startTime={booking.startTime}
          endTime={booking.endTime}
          userType={userType}
          isDisabled={booking.isDisabled}
          isBookedVolunteer={booking.isBookedVolunteer}
          isBookedRider={booking.isBookedRider}
          user={userType}
        />
      ))}
    </Slots>
  );
}
