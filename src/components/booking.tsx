import { Timeslot } from "../models";
export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  unavailableDates: Date[];
  volunteerBookings: {
    id: string;
    title: string;
    date: Date;
    timeslotId: string;
    userId: string;
    description: string;
  }[];
  riderBookings: {
    id: string;
    title: string;
    date: Date;
    timeslotId: string;
    userId: string;
    description: string;
  }[];
}

export const timeslots: TimeSlot[] = [
  {
    id: "timeslot-1",
    startTime: new Date("May 25, 2023 09:00:00"),
    endTime: new Date("May 23, 2023 09:30:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [
      {
        id: "rider-booking-1",
        title: "Volunteer 1",
        date: new Date("May 25, 2023 09:00:00"),
        timeslotId: "timeslot-1",
        userId: "volunteer-1",
        description: "Volunteer booking for timeslot 1",
      },
    ],
  },
  {
    id: "timeslot-2",
    startTime: new Date("May 26, 2023 10:00:00"),
    endTime: new Date("May 26, 2023 10:40:00"),
    unavailableDates: [],
    volunteerBookings: [
      {
        id: "volunteer-booking-1",
        title: "Volunteer 1",
        date: new Date("May 26, 2023 10:00:00"),
        timeslotId: "timeslot-2",
        userId: "volunteer-1",
        description: "Volunteer booking for timeslot 1",
      },
    ],
    riderBookings: [],
  },
  {
    id: "timeslot-3",
    startTime: new Date("April 24, 2023 11:10:00"),
    endTime: new Date("April 24, 2023 11:40:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [
      {
        id: "rider-booking-1",
        title: "Volunteer 1",
        date: new Date("April 23, 2023 09:00:00"),
        timeslotId: "timeslot-1",
        userId: "volunteer-1",
        description: "Volunteer booking for timeslot 1",
      },
    ],
  },
  {
    id: "timeslot-4",
    startTime: new Date("April 25, 2023 12:00:00"),
    endTime: new Date("April 25, 2023 12:40:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [],
  },
  {
    id: "timeslot-5",
    startTime: new Date("May 24, 2023 13:10:00"),
    endTime: new Date("May 24, 2023 13:40:00"),
    unavailableDates: [],
    volunteerBookings: [],
    riderBookings: [
      {
        id: "rider-booking-1",
        title: "Volunteer 1",
        date: new Date("May 23, 2023 13:10:00"),
        timeslotId: "timeslot-1",
        userId: "volunteer-1",
        description: "Volunteer booking for timeslot 1",
      },
    ],
  },
  {
    id: "timeslot-5",
    startTime: new Date("May 24, 2023 14:10:00"),
    endTime: new Date("May 24, 2023 14:40:00"),
    unavailableDates: [],
    volunteerBookings: [
      {
        id: "vol-booking-1",
        title: "Volunteer 1",
        date: new Date("May 24, 2023 14:10:00"),
        timeslotId: "timeslot-1",
        userId: "volunteer-1",
        description: "Volunteer booking for timeslot 1",
      },
    ],
    riderBookings: [],
  },
];
