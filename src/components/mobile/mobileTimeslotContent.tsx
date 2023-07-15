import styled from "styled-components";
import "@fontsource/roboto";
import { useState, useContext } from "react";
import Horse from "../../images/horseRider.svg";
import Dude from "../../images/person.svg";
import Bookmark from "../../images/bookmark.svg";
import OnSlide from "../../images/onslider.png";
import OffSlide from "../../images/offslider.png";
import UserContext from "../../userContext";
import MobileTimeSlotConfirmation from "./mobileTimeslotConfirmation";
import TimeslotSuccess from "../popup/timeslotSuccess";

const RiderInfo = styled.div`
  display: flex;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 90%;
  line-height: 19px;
  color: black;
  background: white;
  margin-bottom: 25px;
  margin-left: 2%;
`;

const LogoRider = styled.img`
  width: 30px;
`;
const LogoDude = styled.img`
  width: 30px;
`;
const LogoBookmark = styled.img`
  width: 30px;
`;

// height 380px so that it stays that height (right now height changes based on rendering of components)
const BoxMobile = styled.div`
  border: solid 0.5px #c4c4c4;
  display: flex;
  font-family: "Rubik", sans-serif;
  background: white;
  width: 80%;
  margin-left: -12%;
`;

const HeaderMobile = styled.h1`
  color: #1b4c5a;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
  margin-bottom: 13%;
  margin-left: 2%;
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

const RiderContent = styled.text`
  flex-direction: row;
  width: 100%;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 700;
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
  bookingsfake: number;
  date: Date;
  tId: string;
  setRequery: (requery: boolean) => void;
};

export default function TimeslotMobileContent({
  bookingsfake,
  date,
  tId,
  setRequery,
}: TimeslotMobileContentProps) {
  const [booked, setBooked] = useState(true);
  const [onOff, setOnOff] = useState(true);
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [successShown, setSuccessShown] = useState(false);
  const currentUserFR = useContext(UserContext);
  const { currentUser } = currentUserFR;
  const [realUser] = currentUser;
  const { userType } = realUser;

  // eslint-disable-next-line no-param-reassign
  // bookings = 0;
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

  const handleClick = () => {
    // Keeping track of the bookings for the user type because rider can't book
    // more than one sesh
    if (booked === false) {
      // add one from bookings if they add their booking
      // eslint-disable-next-line no-param-reassign
      bookingsfake += 1;
      setBooked(!booked);
    } else if (userType === "Rider" && bookingsfake === 1) {
      // if they're a rider and already have a booking don't add more
      // eslint-disable-next-line no-param-reassign
      bookingsfake = 1;
    } else {
      // minus one from bookings if they cancel
      // eslint-disable-next-line no-param-reassign
      bookingsfake -= 1;
      setBooked(!booked);
    }
    // eslint-disable-next-line no-console
    // console.log(bookings);
  };

  return (
    <WrapperMobile>
      <BoxMobile style={{ display: "block" }}>
        {!confirmationShown && (
          <BoxMobileContent>
            <HeaderMobile>Appointment Info</HeaderMobile>
            <RiderInfo
              style={{
                display:
                  (userType === "Admin" && onOff === true) ||
                  userType === "Rider" ||
                  userType === "Volunteer"
                    ? "block"
                    : "none",
              }}
            >
              <LogoRider src={Horse} />{" "}
              <RiderContent> Riders: Jane Doe, John Smith</RiderContent>
            </RiderInfo>

            <RiderInfo
              style={{
                display:
                  userType === "Rider" ||
                  (userType === "Admin" && onOff === false)
                    ? "none"
                    : "block",
              }}
            >
              <LogoDude src={Dude} />{" "}
              <RiderContent>Volunteers: Jane Doe, John Smith</RiderContent>
            </RiderInfo>
            {booked === false ? (
              <RiderInfo
                style={{ display: userType === "Admin" ? "none" : "block" }}
              >
                <LogoBookmark src={Bookmark} />{" "}
                <RiderContent>Status: Booked</RiderContent>
              </RiderInfo>
            ) : (
              <RiderInfo
                style={{ display: userType === "Admin" ? "none" : "block" }}
              >
                <LogoBookmark src={Bookmark} />{" "}
                <RiderContent>Status: Unbooked</RiderContent>
              </RiderInfo>
            )}
            {/* don't have a way of counting number of bookings for people across multiple sessions yet 
              because I am only making the appt pop up. Will probably have to add more functionality
              when implementing the pop up in the calendar */}
            {booked === true ? (
              <TimeslotButton
                style={{
                  display:
                    userType === "Admin" ||
                    (userType === "Rider" && bookingsfake === 1)
                      ? "none"
                      : "block",
                }}
                onClick={handleConfirmationShown}
              >
                Book time slot
              </TimeslotButton>
            ) : (
              <TimeslotButton
                style={{
                  display:
                    userType === "Admin" ||
                    (userType === "Rider" && bookingsfake === 1)
                      ? "none"
                      : "block",
                }}
                onClick={handleClick}
              >
                Cancel time slot
              </TimeslotButton>
            )}
            {onOff === true ? (
              <OnOffSlide
                style={{ display: userType === "Admin" ? "block" : "none" }}
                onClick={handleSlide}
                src={OnSlide}
              />
            ) : (
              <OnOffSlide
                style={{ display: userType === "Admin" ? "block" : "none" }}
                onClick={handleSlide}
                src={OffSlide}
              />
            )}
          </BoxMobileContent>
        )}
        {confirmationShown && !successShown && (
          <BoxMobileContent>
            <MobileTimeSlotConfirmation
              handleClicked={handleSuccessShown}
              handleCancelled={handleCancelled}
              status="book"
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
