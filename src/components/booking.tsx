export interface TimeSlotsData {
  startTime: Date;
  endTime: Date;
  unavailableDates: Date[];
  volunteerBookings: String[];
  riderBookings: String[];
}

export const bookings = [
  {
    startTime: new Date("March 19, 2023 09:00:00"),
    endTime: new Date("March 19, 2023 09:30:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  },
  {
    startTime: new Date("March 22, 2023 12:20:00"),
    endTime: new Date("March 22, 2023 12:50:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  },
  {
    startTime: new Date("March 23, 2023 11:10:00"),
    endTime: new Date("March 23, 2023 11:40:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  },
  {
    startTime: new Date("March 21, 2023 4:30:00"),
    endTime: new Date("March 21, 2023 5:00:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  },
  {
    startTime: new Date("March 24, 2023 10:00:00"),
    endTime: new Date("March 24, 2023 10:30:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  },
];
