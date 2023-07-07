export interface Users {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  userType: "admin" | "volunteer" | "rider";
  bookings: [number];
}
