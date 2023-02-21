import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import logoPic from "../images/PETlogo.jpg";
import eyeSlash from "../images/eyeSlash.svg";
import {
  Wrapper,
  Box,
  Button,
  Input,
  Label,
  PasswordContainer,
  EyeSlash,
  Question,
  TextLink,
  ErrorMessage,
} from "./styledComponents";

const Logo = styled.img`
  display: flex;
  margin: auto;
  /* PET_FINAL logo 1 */
  width: 150px;
`;

function addAccount() {
  alert("You clicked login");
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Initialize a boolean state
  const [passwordShown, setPasswordShown] = useState(false);
  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  const [validEmail, setValidEmail] = React.useState(false);
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
      <Box>
        <Logo src={logoPic} alt="PET logo" />
        {validEmail && (
          <ErrorMessage>Invalid email. Please try again.</ErrorMessage>
        )}
        <Label>Email</Label>
        <Input
          placeholder=""
          type="email"
          value={email} // add newEmail as the input's value
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
        <Label>Password</Label>
        <PasswordContainer>
          <EyeSlash onClick={togglePassword}>
            <img src={eyeSlash} alt="didn't work" />
          </EyeSlash>
          <Input
            type={passwordShown ? "text" : "password"}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            onFocus={(e) => {
              e.currentTarget.parentElement?.classList.remove("inputBlur");
              e.currentTarget.parentElement?.classList.add("inputFocus");
            }}
            onBlur={(e) => {
              e.currentTarget.parentElement?.classList.remove("inputFocus");
              e.currentTarget.parentElement?.classList.add("inputBlur");
            }}
            onClick={(e) => {
              e.currentTarget.scrollLeft = e.currentTarget.scrollWidth;
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              );
            }}
          />
        </PasswordContainer>
        <TextLink to="/forgot-password">Forgot password?</TextLink>
        <Button onClick={addAccount}>Log In</Button>
        <Question>
          Don&apos;t have an account?&nbsp;
          <TextLink to="/create-account">Create Account</TextLink>
        </Question>
      </Box>
    </Wrapper>
  );
}
