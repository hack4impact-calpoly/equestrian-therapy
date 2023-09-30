import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Auth } from "aws-amplify";
import { User } from "../../models";
import warning from "../../images/warning.svg";
import {
  Wrapper,
  BackArrow,
  Box,
  Header,
  Button,
  Row,
} from "../styledComponents";
import backArrow from "../../images/backArrowIcon.png";
import UserContext from "../../userContext";

const Warning = styled.img`
  @media (max-width: 500px) {
    position: relative;
    width: 80px;
  }
`;

const Description = styled.text`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  color: #000d26;
  text-align: left;
  padding-bottom: 20px;
`;

const SurroundingBox = styled(Box)`
  @media (max-width: 500px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-left: 15%;
    padding-right: 15%;
    padding-top: 10%;
    padding-bottom: 10%;
  }
`;

const ConfirmButton = styled(Button)`
  @media (max-width: 500px) {
    width: 11rem;
    height: 3rem;
    margin-left: 1rem;
  }
`;

export default function MobileLogout() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      setUser({} as User[]);
      navigate("/login");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error signing out: ", error);
    }
  };

  return (
    <Wrapper>
      <BackArrow
        src={backArrow}
        alt="didn't work"
        onClick={() => {
          navigate("/");
        }}
      />
      <SurroundingBox>
        <Warning src={warning} />
        <Header>Signing Out?</Header>
        <Description>
          You are attempting to logout of your account. Doing so will take you
          back to the sign in page.
        </Description>
        <Row>
          <ConfirmButton onClick={handleLogout}>Logout</ConfirmButton>
        </Row>
      </SurroundingBox>
    </Wrapper>
  );
}
