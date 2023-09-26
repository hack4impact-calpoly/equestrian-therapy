import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import lock from "../../images/lock.svg";
import arrow from "../../images/backArrow.png";
import {
  BackArrow,
  Box,
  Button,
  CenteredHeader,
  Description,
  ErrorMessage,
  Input,
  Wrapper,
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
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const username = localStorage.getItem("username") || "";
  const navigate = useNavigate();

  /**
   * This function is run when the user clicks the Verify button, it will call the Auth function with the user's
   * email and verification code to confirm their signup in the AWS userpool. Once complete it will clear the
   * localstorage and navigate to the success page. If the auth function fails it will console log the error.
   */
  async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(username, code);
      localStorage.clear();
      navigate("/success/:id=signUp", { replace: true });
    } catch (errore) {
      // eslint-disable-next-line no-console
      console.log("error confirming sign up", errore);
      if (errore instanceof Error) {
        setError(errore.message);
      } else {
        setError(String(errore));
      }
    }
  }

  // This function is run when the user clicks the Verify button and calls confirmSignup
  const codeVerification = () => {
    confirmSignUp();
  };

  /**
   * This function is run when the user clicks the Resend Code button, it will call the Auth function with the
   * user's email to resend the signup code so the user can recieve the code they need to confirm their account
   * signup. It will console log an error message if the auth call doesn't work.
   */
  async function resendConfirmationCode() {
    try {
      await Auth.resendSignUp(username);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("error resending code: ", err);
    }
  }

  // This function is run when the user clicks the Resend Code button and calls resendConfirmationCode
  const resendCode = () => {
    // eslint-disable-next-line no-alert
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
