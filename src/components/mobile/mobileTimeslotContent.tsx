import styled from "styled-components";
import "@fontsource/roboto";
import { useState } from "react";
import Horse from "../../images/horseRider.svg";
import Dude from "../../images/person.svg";
import Bookmark from "../../images/bookmark.svg";
import OnSlide from "../../images/onslider.png";
import OffSlide from "../../images/offslider.png";

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
  // width: 85%;
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
  margin-bottom: 10px;
`;
const BoxMobileContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4%;
  width: 310px;
`;
const RiderContent = styled.text`
  flex-direction: row;
  width: 100%;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 700;
`;

const TimeslotButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const TimeslotButton = styled.button`
  color: #1b4c5a;
  border: none;
  background: none;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 5%;
  cursor: pointer;
`;
const OnOffSlide = styled.img`
  margin-bottom: 5%;
  width: 20%;
  margin-left: 75%;
  margin-top: 20%;
`;
type UserType = {
  user: string;
  bookings: number;
};
// READ: bookings prop will always be 1 or -1 cause I hardcoded the initial value of bookings
// (line 103) so it turns back to 0 every run. Hopefully this logic works once we get the
// props working on the other pages.
export default function TimeslotMobileContent({ user, bookings }: UserType) {
  const [booked, setBooked] = useState(true);
  const [onOff, setOnOff] = useState(true);

  // eslint-disable-next-line no-param-reassign
  bookings = 0;
  const handleSlide = () => {
    setOnOff(!onOff);
  };
  const handleClick = () => {
    // Keeping track of the bookings for the user type because rider can't book
    // more than one sesh
    if (booked === false) {
      // add one from bookings if they add their booking
      // eslint-disable-next-line no-param-reassign
      bookings += 1;
      setBooked(!booked);
    } else if (user === "rider" && bookings === 1) {
      // if they're a rider and already have a booking don't add more
      // eslint-disable-next-line no-param-reassign
      bookings = 1;
    } else {
      // minus one from bookings if they cancel
      // eslint-disable-next-line no-param-reassign
      bookings -= 1;
      setBooked(!booked);
    }
    // eslint-disable-next-line no-console
    // console.log(bookings);
  };

  // HARD CODED
  // eslint-disable-next-line no-param-reassign
  // user = "admin";
  // eslint-disable-next-line no-console
  // console.log(user);
  // eslint-disable-next-line no-console
  // console.log(booked);
  // eslint-disable-next-line no-console
  // console.log("onOff", onOff);
  return (
    <WrapperMobile>
      <BoxMobile>
        <BoxMobileContent>
          <HeaderMobile>Appointment Info</HeaderMobile>
          <RiderInfo
            style={{
              display:
                (user === "admin" && onOff === true) ||
                user === "rider" ||
                user === "volunteer"
                  ? "flex"
                  : "none",
            }}
          >
            <LogoRider src={Horse} />{" "}
            <RiderContent> Riders: Jane Doe, John Smith</RiderContent>
          </RiderInfo>

          <RiderInfo
            style={{
              display:
                user === "rider" || (user === "admin" && onOff === false)
                  ? "none"
                  : "flex",
            }}
          >
            <LogoDude src={Dude} />{" "}
            <RiderContent>Volunteers: Jane Doe, John Smith</RiderContent>
          </RiderInfo>
          {booked === false ? (
            <RiderInfo style={{ display: user === "admin" ? "none" : "flex" }}>
              <LogoBookmark src={Bookmark} />{" "}
              <RiderContent>Status: Booked</RiderContent>
            </RiderInfo>
          ) : (
            <RiderInfo style={{ display: user === "admin" ? "none" : "flex" }}>
              <LogoBookmark src={Bookmark} />{" "}
              <RiderContent>Status: Unbooked</RiderContent>
            </RiderInfo>
          )}
          {/* don't have a way of counting number of bookings for people across multiple sessions yet 
              because I am only making the appt pop up. Will probably have to add more functionality
              when implementing the pop up in the calendar */}
          {booked === true ? (
            <TimeslotButtonWrapper>
              <TimeslotButton
                style={{
                  display:
                    user === "admin" || (user === "rider" && bookings === 1)
                      ? "none"
                      : "flex",
                }}
                onClick={handleClick}
              >
                Book time slot
              </TimeslotButton>
            </TimeslotButtonWrapper>
          ) : (
            <TimeslotButtonWrapper>
              <TimeslotButton
                style={{
                  display:
                    user === "admin" || (user === "rider" && bookings === 1)
                      ? "none"
                      : "flex",
                }}
                onClick={handleClick}
              >
                Cancel time slot
              </TimeslotButton>
            </TimeslotButtonWrapper>
          )}
          {onOff === true ? (
            <OnOffSlide
              style={{ display: user === "admin" ? "flex" : "none" }}
              onClick={handleSlide}
              src={OnSlide}
            />
          ) : (
            <OnOffSlide
              style={{ display: user === "admin" ? "flex" : "none" }}
              onClick={handleSlide}
              src={OffSlide}
            />
          )}
        </BoxMobileContent>
      </BoxMobile>
    </WrapperMobile>
  );
}
