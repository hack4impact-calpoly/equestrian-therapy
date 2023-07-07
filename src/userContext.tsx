import { createContext } from "react";
// import { Users } from "./types";
import { User } from "./models";

const defaultFields = {
  currentUser: {} as User[],
  setUser: (() => {}) as (user: User[]) => void,
};

const UserContext = createContext(defaultFields);
export default UserContext;
