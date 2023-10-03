import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Auth } from "aws-amplify";
import { User } from "../../models";
import warning from "../../images/warning.svg";
import {
  Box,
  Button,
  Description,
  Header,
  PopupDiv,
  Row,
} from "../styledComponents";
import UserContext from "../../userContext";

const CancelButton = styled(Button)`
  width: 11rem;
  height: 3rem;
  background: white;
  color: #1b4c5a;
  margin-right: 1rem;
`;

const ConfirmButton = styled(Button)`
  width: 11rem;
  height: 3rem;
  margin-left: 1rem;
`;

const SurroundingBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 15%;
  padding-right: 15%;
  padding-top: 10%;
  padding-bottom: 10%;
`;

const Warning = styled.img`
  position: relative;
  width: 80px;
`;

type PopupProps = {
  openProp: boolean;
  onClose: () => void;
};

export default function LogoutPopup({ openProp, onClose }: PopupProps) {
  const [open, setOpen] = useState<boolean>(openProp);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  /**
   * This useEffect is run when the openProp updates and will set the open useState variable to the
   * new value of openProp, this ensures that any external changes to openProp are logged in the new
   * open useState variable created here.
   */
  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  /**
   * This function is run when the user clicks the Logout button, it will call the Auth signOut
   * function if that succeeds it will set the user useState variable to an empty object and
   * navigate to the login page, if it fails then it will catch the error and console log it.
   */
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
    <PopupDiv open={open} onClose={onClose}>
      <SurroundingBox>
        <Warning src={warning} />
        <Header>Signing Out?</Header>
        <Description>
          You are attempting to logout of your account. Doing so will take you
          back to the sign in page.
        </Description>
        <Row>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={handleLogout}>Logout</ConfirmButton>
        </Row>
      </SurroundingBox>
    </PopupDiv>
  );
}
