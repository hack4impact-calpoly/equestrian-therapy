import { createContext } from "react";

// create a context with the properties of our user data
interface UserData {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  userType: string;
  bookings: [number];
}
const exuser: UserData = {
  id: 1,
  userName: "",
  firstName: "",
  lastName: "",
  userType: "",
  bookings: [1],
};

const UserContext = createContext(exuser);
export default UserContext;
