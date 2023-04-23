import React, { ChangeEvent, useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import logoPic from "../../images/PETlogo.jpg";
import eyeSlash from "../../images/eyeSlash.svg";
import eye from "../../images/eye.svg";
import UserContext from "../../userContext";

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
} from "../styledComponents";
import { User } from "../../types";

const Logo = styled.img`
  display: flex;
  margin: auto;
  /* PET_FINAL logo 1 */
  width: 150px;
`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  // Initialize a boolean state
  const [passwordShown, setPasswordShown] = useState(false);
  // const [userName] = useContext(email);
  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  async function signIn() {
    try {
      console.log(email);

      const { user } = await Auth.signIn({
        username: email,
        password,
      });
      // setting the userName for the userContext
      setUser({ userName: `${email}` } as User);
      console.log("Success!");
      console.log(user);
      // Navigates to Home page with weekly calendar
      // setUser({ userName: `${email}` } as User);

      navigate("/");
    } catch (errore) {
      console.log("error signing in", errore);
      if (errore instanceof Error) {
        setError(errore.message);
      } else {
        setError(String(errore));
      }
    }
  }

  const handleSubmit = () => {
    setError("");

    if (!email || !password) {
      setError("All Fields Required");
      return;
    }

    signIn();
  };

  return (
    <Wrapper>
      <Box>
        <Logo src={logoPic} alt="PET logo" />
        {error && <ErrorMessage>{error}</ErrorMessage>}
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
        />

        <Label>Password</Label>
        <PasswordContainer>
          <EyeSlash onClick={togglePassword}>
            {passwordShown ? (
              <img src={eye} alt="did work" />
            ) : (
              <img src={eyeSlash} alt="didn't work" />
            )}
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
        <Button onClick={handleSubmit}>Log In</Button>
        <Question>
          Don&apos;t have an account?&nbsp;
          <TextLink to="/create-account">Create Account</TextLink>
        </Question>
      </Box>
    </Wrapper>
  );
}
