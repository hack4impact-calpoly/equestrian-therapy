import React, { ChangeEvent, useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Auth, DataStore } from "aws-amplify";
import logoPic from "../../images/petLogo.jpg";
import eyeSlash from "../../images/eyeSlash.svg";
import eye from "../../images/eye.svg";
import UserContext from "../../userContext";
import { User } from "../../models";
import {
  Box,
  Button,
  ErrorMessage,
  EyeSlash,
  Input,
  Label,
  PasswordContainer,
  Question,
  TextLink,
  Wrapper,
} from "../styledComponents";

const Logo = styled.img`
  display: flex;
  margin: auto;
  width: 150px;
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  /**
   * This function is run when the user clicks the Log In button and they both input fields are filled. It will
   * run the Auth.signIn function with the user's email and password then query for the user's corresponding
   * object in the Datastore and set that to our user useState variable. It will then navigate to the home page
   * of our app. If any step in this process fails it will display an error message
   */
  async function signIn() {
    try {
      await Auth.signIn({
        username: email,
        password,
      });

      const users = await DataStore.query(User, (c) => c.userName.eq(email));
      setUser(users as User[]);

      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  }

  /**
   * This function is run when the user clicks the Log In button, it will first validate that the user has
   * typed both a username and password then it will call the signIn function described above. If the user has
   * not submitted both an email and password it will display an error.
   */
  const handleSubmit = () => {
    setError("");

    // If the user hasn't submitted both an email and password then set an error message.
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
          type="text"
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
        />

        <Label>Password</Label>
        <PasswordContainer>
          {passwordShown ? (
            <EyeSlash onClick={togglePassword} src={eye} />
          ) : (
            <EyeSlash onClick={togglePassword} src={eyeSlash} />
          )}
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
