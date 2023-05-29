import { useContext } from "react";
import styled from "styled-components";
import UserContext from "../../userContext";
import MobileTimeslot from "./mobileTimeslot";

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

const timeslots = [
  {
    startTime: new Date(2023, 2, 7, 9, 0),
    endTime: new Date(2023, 2, 7, 10, 0),
  },
  {
    startTime: new Date(2023, 2, 7, 10, 0),
    endTime: new Date(2023, 2, 7, 11, 0),
  },
  {
    startTime: new Date(2023, 2, 7, 11, 0),
    endTime: new Date(2023, 2, 7, 12, 0),
  },
  {
    startTime: new Date(2023, 2, 7, 12, 0),
    endTime: new Date(2023, 2, 7, 13, 0),
  },
  {
    startTime: new Date(2023, 2, 7, 13, 0),
    endTime: new Date(2023, 2, 7, 14, 0),
  },
  {
    startTime: new Date(2023, 2, 7, 14, 0),
    endTime: new Date(2023, 2, 7, 15, 0),
  },
  {
    startTime: new Date(2023, 2, 7, 15, 0),
    endTime: new Date(2023, 2, 7, 16, 0),
  },
  {
    startTime: new Date(2023, 2, 7, 16, 0),
    endTime: new Date(2023, 2, 7, 17, 0),
  },
];

export default function MobileTimeslots() {
  let filteredTimeslots: { startTime: Date; endTime: Date }[] = [];
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;
  if (realUser !== null) {
    console.log("mobile timeslots component just needs userType");
    console.log(userType);
  }
  if (userType === "Volunteer") {
    // Filter timeslots between 9 AM and 5 PM for volunteers
    filteredTimeslots = timeslots.filter(
      (timeslot) =>
        timeslot.startTime.getHours() >= 9 && timeslot.endTime.getHours() <= 17
    );
  } else if (userType === "Rider") {
    // Filter timeslots between 10 AM and 2 PM for riders
    filteredTimeslots = timeslots.filter(
      (timeslot) =>
        timeslot.startTime.getHours() >= 10 && timeslot.endTime.getHours() <= 14
    );
  } else if (userType === "Admin") {
    // show's all time slots for admin
    filteredTimeslots = timeslots;
  }

  return (
    <Slots>
      {filteredTimeslots.map((timeslot) => (
        <MobileTimeslot
          startTime={timeslot.startTime}
          endTime={timeslot.endTime}
        />
      ))}
    </Slots>
  );
}
