import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import logo from "../../images/horseRider.svg";
import {
  Box,
  Button,
  CenteredDescription,
  CenteredHeader,
  Wrapper,
} from "../styledComponents";

const Logo = styled.img`
  width: 2.5em;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export default function Success() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Navigates the user back to the login page
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <Wrapper>
      <Box>
        <Logo src={logo} />
        <CenteredHeader>Success!</CenteredHeader>
        <CenteredDescription>
          {id === "reset"
            ? "You have successfully reset your password."
            : "You have successfully signed up for an account."}
        </CenteredDescription>
        <Button onClick={handleClick}>Back to Login</Button>
      </Box>
    </Wrapper>
  );
}
