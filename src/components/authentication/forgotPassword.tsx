/* eslint-disable no-console */
import React, { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import arrow from "../../images/backArrow.png";
import {
  Wrapper,
  Box,
  BackArrow,
  Button,
  Header,
  Description,
  Input,
  Label,
  ErrorMessage,
} from "../styledComponents";

// setEmail prop that is set in a form in this page
type ForgotPasswordProps = {
  setEmailProp: (val: string) => void;
};

export default function forgotPassword({ setEmailProp }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  // const [email] = useState("");
  const navigate = useNavigate();
  const [validEmail, setValidEmail] = React.useState(false);
  const [error, setError] = useState("");
  const sendEmail = async () => {
    setError("");
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      setValidEmail(false);
    } else {
      setEmailProp(email);
      // need to send auth request for sending the verification code
      try {
        await Auth.forgotPassword(email).then((data) => console.log(data));
        // need to somehow pass username prop to reset-password page
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

  const handleOnChangeEmail = (email1: string) => {
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
          value={email} // add newEmail as the input's value
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            // this event handler updates the value of newIngredient
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
