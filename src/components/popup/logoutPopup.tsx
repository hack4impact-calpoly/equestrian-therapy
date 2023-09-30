import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Auth } from "aws-amplify";
import { User } from "../../models";
import warning from "../../images/warningIcon.svg";
import {
  // Wrapper,
  Box,
  Description,
  Header,
  Button,
  Row,
  PopupDiv,
  // PopupBox,
} from "../styledComponents";
import UserContext from "../../userContext";

const Warning = styled.img`
  position: relative;
  width: 80px;
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

const ConfirmButton = styled(Button)`
  width: 11rem;
  height: 3rem;
  margin-left: 1rem;
`;

const CancelButton = styled(Button)`
  width: 11rem;
  height: 3rem;
  background: white;
  color: #1b4c5a;
  margin-right: 1rem;
`;

interface PopupProps {
  openProp: boolean;
  onClose: () => void;
}

export default function LogoutPopup({ openProp, onClose }: PopupProps) {
  const [open, setOpen] = useState<boolean>(openProp);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

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
