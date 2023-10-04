/* eslint-disable no-console */
import React, { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import arrow from "../../images/backArrow.png";
import {
  BackArrow,
  Box,
  Button,
  Description,
  ErrorMessage,
  Header,
  Input,
  Label,
  Wrapper,
} from "../styledComponents";

// setEmail prop that is set in a form in this page
type ForgotPasswordProps = {
  setEmailProp: (val: string) => void;
};

export default function forgotPassword({ setEmailProp }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = React.useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * This function is run when the user clicks the Send button, it will first validate the user's entered email
   * Then it will send an auth request with that email and navigate the user to the reset password. If any of
   * those checks fail then an error message will be set and displayed to the user.
   */
  const sendEmail = async () => {
    setError("");

    // This regex checks that a string is a valid email address.
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // If the email is not valid then set the error message, otherwise try sending the Auth.forgotPassword request
    if (!re.test(email)) {
      setValidEmail(false);
    } else {
      setEmailProp(email);
      // need to send auth request for sending the verification code
      try {
        await Auth.forgotPassword(email);
        navigate("/reset-password");
      } catch (errore) {
        console.log("error sending code:", errore);
        if (errore instanceof Error) {
          setError(errore.message);
        } else {
          setError(String(errore));
          navigate("/reset-password");
        }
      }
    }
  };

  /**
   * This function is run everytime the user interacts with the email input field, it will first validate the
   * user's entered email and if the check fails then an error message will be set and displayed to the user.
   */
  const handleOnChangeEmail = (email1: string) => {
    // This regex checks that a string is a valid email address.
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email1)) {
      setValidEmail(false);
    } else {
      setValidEmail(true);
    }
  };

  return (
    <Wrapper>
      <Link to="/login">
        <BackArrow src={arrow} />
      </Link>
      <Box>
        <Header>Forgot Password</Header>
        <Description>
          Please enter the email associated with your account to receive a reset
          link.
        </Description>
        {validEmail && <ErrorMessage>Please enter valid email.</ErrorMessage>}
        <Label>Email</Label>
        <Input
          placeholder=""
          type="text"
          className="invalidEmail"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
          onClick={(e) => {
            e.currentTarget.scrollLeft = e.currentTarget.scrollWidth;
            e.currentTarget.setSelectionRange(
              e.currentTarget.value.length,
              e.currentTarget.value.length
            );
          }}
          onBlur={() => {
            handleOnChangeEmail(email);
          }}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="button" className="sendButton" onClick={sendEmail}>
          Send
        </Button>
      </Box>
    </Wrapper>
  );
}
