export interface EventProps {
  id: number;
  title: string;
  date: Date; // AWSDate
  timeslotId: number[]; // (array of timeslot IDs, allows volunteers to sign up for multiple timeslots in one booking)
  userId: number;
  description: string;
}
