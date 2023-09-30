import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import lock from "../../images/lock.svg";
import arrow from "../../images/backArrowIcon.png";
import {
  Wrapper,
  Box,
  Button,
  BackArrow,
  Input,
  Description,
  ErrorMessage,
  CenteredHeader,
} from "../styledComponents";

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

export default function EnterCode() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(username, code);
      localStorage.clear();
      navigate("/success/:id=signUp", { replace: true });
    } catch (errore) {
      console.log("error confirming sign up", errore);
      if (errore instanceof Error) {
        setError(errore.message);
      } else {
        setError(String(errore));
      }
    }
  }

  async function resendConfirmationCode() {
    try {
      await Auth.resendSignUp(username);
    } catch (err) {
      console.log("error resending code: ", err);
    }
  }

  const codeVerification = () => {
    confirmSignUp();
  };

  // temporary alert (later resend code to email)
  const resendCode = () => {
    alert("Resent Code");
    resendConfirmationCode();
  };

  return (
    <Wrapper>
      <BackArrow src={arrow} onClick={() => navigate("/login")} />
      <Box>
        <Lock src={lock} />
        <CenteredHeader>Enter Code</CenteredHeader>
        <Description>
          We’ve sent an email to {username} with your authentication code.
        </Description>
        {error !== "" && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          value={code}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCode(e.target.value)
          }
        />
        <Resend onClick={resendCode}>Resend code</Resend>
        <Button onClick={codeVerification}>Verify</Button>
      </Box>
    </Wrapper>
  );
}
