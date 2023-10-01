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

const BoxMobile = styled.div`
  border: solid 0.5px #c4c4c4;
  display: flex;
  font-family: "Rubik", sans-serif;
  background: white;
  width: 80%;
  margin-left: -12%;
`;

const BoxMobileContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4%;
  width: 300px;
`;

const OnOffSlide = styled.img`
  margin-bottom: 5%;
  width: 20%;
  margin-left: 75%;
  margin-top: 20%;
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

const WrapperMobile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

/**
 * This function takes a javascript Date object and converts it to a string in YYYY-MM-DD format
 * Input:
 *  - date: Date - The date object to be converted to YYYY-MM-DD format
 * Output:
 *  - retString: string - the string version of the date in YYYY-MM-DD format
 */
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

type TimeslotMobileContentProps = {
  timeslotId: string;
  allBookings: Booking[];
  checked: boolean;
  date: Date;
  enabled: boolean;
  riderBookings: LazyUser[];
  riderDisabled: boolean;
  toggleValue: string;
  volunteerBookings: LazyUser[];
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRequery: (requery: boolean) => void;
};

export default function TimeslotMobileContent({
  timeslotId,
  allBookings,
  checked,
  date,
  enabled,
  riderBookings,
  riderDisabled,
  toggleValue,
  volunteerBookings,
  setIsDropdownOpen,
  setRequery,
}: TimeslotMobileContentProps) {
  const [onOff, setOnOff] = useState(checked);
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [successShown, setSuccessShown] = useState(false);

  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  /**
   * This function is run when the user clicks the book/unbook button or the on/off slider
   * and will prompt the confirmation screen as well as inverse the onOff useState variable
   */
  const handleConfirmationShown = () => {
    setConfirmationShown(true);
    setOnOff(!enabled);
  };

  /**
   * This function is run when the user clicks the confirm button inside MobileTimeSlotConfirmation
   * and will cause the success component to be shown by setting successShown to true
   */
  const handleSuccessShown = () => {
    setSuccessShown(true);
  };

  /**
   * This function is run when the user clicks the cancel button inside MobileTimeSlotConfirmation
   * and will set successShown and confirmationShown to false as well as closing the dropdown by
   * setting isDropdownOpen to false.
   */
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
              booked={checked}
              riderBookings={riderBookings}
              toggleValue={toggleValue}
              volunteerBookings={volunteerBookings}
            />
            {userType !== "Admin" ? (
              !(
                userType === "Rider" &&
                allBookings.some(
                  (booking) =>
                    booking.date === convertToYMD(date) &&
                    booking.userID === realUser.id &&
                    booking.timeslotID !== timeslotId
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
              timeslotId={timeslotId}
              allBookings={allBookings}
              checked={checked}
              date={date}
              riderDisabled={riderDisabled}
              toggleValue={toggleValue}
              handleCancelled={handleCancelled}
              handleClicked={handleSuccessShown}
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
