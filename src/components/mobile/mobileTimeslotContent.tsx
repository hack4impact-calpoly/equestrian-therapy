/* eslint-disable no-nested-ternary */
import styled from "styled-components";
import "@fontsource/roboto";
import { useState, useContext } from "react";
import OnSlide from "../../images/onSlider.png";
import OffSlide from "../../images/offSlider.png";
import UserContext from "../../userContext";
import MobileTimeSlotConfirmation from "./mobileTimeslotConfirmation";
import TimeslotSuccess from "../popup/timeslotSuccess";
import AppointmentInfo from "../appointmentInfo";
import { Booking, LazyUser } from "../../models";
// height 380px so that it stays that height (right now height changes based on rendering of components)
const BoxMobile = styled.div`
  border: solid 0.5px #c4c4c4;
  display: flex;
  font-family: "Rubik", sans-serif;
  background: white;
  width: 80%;
  margin-left: -12%;
`;

const WrapperMobile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BoxMobileContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4%;
  width: 300px;
`;

const TimeslotButton = styled.button`
  color: #1b4c5a;
  border: none;
  background: none;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  margin-left: 45%;
  margin-bottom: 5%;
  cursor: pointer;
`;
const OnOffSlide = styled.img`
  margin-bottom: 5%;
  width: 20%;
  margin-left: 75%;
  margin-top: 20%;
`;

type TimeslotMobileContentProps = {
  date: Date;
  tId: string;
  riderBookings: LazyUser[];
  volunteerBookings: LazyUser[];
  checked: boolean;
  enabled: boolean;
  riderDisabled: boolean;
  toggleValue: string;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allBookings: Booking[];
  setRequery: (requery: boolean) => void;
};

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

export default function TimeslotMobileContent({
  date,
  tId,
  riderBookings,
  volunteerBookings,
  checked,
  enabled,
  riderDisabled,
  toggleValue,
  setIsDropdownOpen,
  allBookings,
  setRequery,
}: TimeslotMobileContentProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;
  const [onOff, setOnOff] = useState(checked);
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [successShown, setSuccessShown] = useState(false);

  const handleConfirmationShown = () => {
    setConfirmationShown(true);
    setOnOff(!enabled);
  };

  const handleSuccessShown = () => {
    setSuccessShown(true);
  };

  const handleCancelled = () => {
    setSuccessShown(false);
    setConfirmationShown(false);
    setIsDropdownOpen(false);
  };

  return (
    <WrapperMobile>
      <BoxMobile>
        {!confirmationShown && (
          <BoxMobileContent>
            <AppointmentInfo
              riderBookings={riderBookings}
              volunteerBookings={volunteerBookings}
              booked={checked}
              toggleValue={toggleValue}
            />
            {userType !== "Admin" ? (
              !(
                userType === "Rider" &&
                allBookings.some(
                  (booking) =>
                    booking.date === convertToYMD(date) &&
                    booking.userID === realUser.id &&
                    booking.timeslotID !== tId
                )
              ) ? (
                <TimeslotButton onClick={handleConfirmationShown}>
                  {`${onOff ? "Cancel" : "Book"} time slot`}
                </TimeslotButton>
              ) : (
                <div />
              )
            ) : (
              <OnOffSlide
                onClick={handleConfirmationShown}
                src={checked ? OnSlide : OffSlide}
              />
            )}
          </BoxMobileContent>
        )}
        {confirmationShown && !successShown && (
          <WrapperMobile>
            <MobileTimeSlotConfirmation
              handleClicked={handleSuccessShown}
              handleCancelled={handleCancelled}
              checked={checked}
              // enabled={onOff}
              date={date}
              tId={tId}
              riderDisabled={riderDisabled}
              toggleValue={toggleValue}
              allBookings={allBookings}
              setRequery={setRequery}
            />
          </WrapperMobile>
        )}
        {confirmationShown && successShown && (
          <TimeslotSuccess handleCancelled={handleCancelled} />
        )}
      </BoxMobile>
    </WrapperMobile>
  );
}
