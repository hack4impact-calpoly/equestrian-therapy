import styled from "styled-components";
import "@fontsource/roboto";
import { useState, useContext } from "react";
import OnSlide from "../../images/OnSlider.png";
import OffSlide from "../../images/OffSlider.png";
import UserContext from "../../userContext";
import MobileTimeSlotConfirmation from "./mobileTimeslotConfirmation";
import TimeslotSuccess from "../popup/timeslotSuccess";
import AppointmentInfo from "../appointmentInfo";
import { LazyUser } from "../../models";
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
  booked: boolean;
  setRequery: (requery: boolean) => void;
  toggleValue: string;
};

export default function TimeslotMobileContent({
  date,
  tId,
  riderBookings,
  volunteerBookings,
  booked,
  setRequery,
  toggleValue,
}: TimeslotMobileContentProps) {
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;
  const [onOff, setOnOff] = useState(true);
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [successShown, setSuccessShown] = useState(false);

  // eslint-disable-next-line no-param-reassign
  const handleSlide = () => {
    setOnOff(!onOff);
  };

  const handleConfirmationShown = () => {
    setConfirmationShown(true);
  };

  const handleSuccessShown = () => {
    setSuccessShown(true);
  };

  const handleCancelled = () => {
    setSuccessShown(false);
    setConfirmationShown(false);
  };

  return (
    <WrapperMobile>
      <BoxMobile style={{ display: "block" }}>
        {!confirmationShown && (
          <BoxMobileContent>
            <AppointmentInfo
              riderBookings={riderBookings}
              volunteerBookings={volunteerBookings}
              booked={booked}
              toggleValue={toggleValue}
            />
            {userType !== "Admin" ? (
              <TimeslotButton onClick={handleConfirmationShown}>
                {`${booked ? "Cancel" : "Book"} time slot`}
              </TimeslotButton>
            ) : (
              <OnOffSlide
                onClick={handleSlide}
                src={onOff ? OnSlide : OffSlide}
              />
            )}
          </BoxMobileContent>
        )}
        {confirmationShown && !successShown && (
          <BoxMobileContent>
            <MobileTimeSlotConfirmation
              handleClicked={handleSuccessShown}
              handleCancelled={handleCancelled}
              booked={booked}
              date={date}
              tId={tId}
              setRequery={setRequery}
            />
          </BoxMobileContent>
        )}
        {confirmationShown && successShown && (
          <TimeslotSuccess handleCancelled={handleCancelled} />
        )}
      </BoxMobile>
    </WrapperMobile>
  );
}
