import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import lock from "../images/lock.svg";
import arrow from "../images/backArrow.png";
import {
  Wrapper,
  Box,
  Button,
  BackArrow,
  Input,
  ErrorMessage,
  Description,
} from "./styledComponents";

const Header = styled.text`
  color: #011338;
  font-size: 40px;
  font-weight: bold;
  margin: 1.5rem 0.5rem;

  text-align: center;
  @media (max-width: 500px) {
    padding: auto;
    width: fit-content;
    font-family: "Rubik";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
  }
`;

const Lock = styled.img`
  color: #011338;
  width: 3em;
  display: block;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 500px) {
    display: none;
  }
`;

const Resend = styled.button`
  color: #000000;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  background: none;
  border: none;
  margin-left: auto;
  padding-top: 10px;
  &:hover {
    text-decoration: underline;
  }
`;

// temporary email placeholder
const user = {
  email: "placeholder@gmail.com",
};

export default function EnterCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // code requirements (at least 8 characters for now)
  const codeValidation = () => {
    const regEx = /^.{8,}$/;
    if (regEx.test(code)) {
      setError("");
    } else if (!regEx.test(code)) {
      setError("Code is Invalid");
    }
  };
  // temporary alert (later verify if input code = sent code, then navigate to /success)
  const codeVerification = () => {
    alert("Verifying Code...");
    // navigate("./login");
  };
  // temporary alert (later resend code to email)
  const resendCode = () => {
    alert("Resent Code");
  };

  return (
    <Wrapper>
      <BackArrow src={arrow} onClick={() => navigate("/login")} />
      <Box>
        <Lock src={lock} />
        <Header>Enter Code</Header>
        <Description>
          We’ve sent an email to {user.email} with your authentication code.
        </Description>
        <Input
          value={code}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCode(e.target.value)
          }
          onBlur={() => codeValidation()}
        />
        <Resend onClick={resendCode}>Resend code</Resend>
        <Button onClick={codeVerification}>Verify</Button>
        <ErrorMessage>{error}</ErrorMessage>
      </Box>
    </Wrapper>
  );
}
