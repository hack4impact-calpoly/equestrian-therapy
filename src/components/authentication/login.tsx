import React, { ChangeEvent, useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Auth, DataStore } from "aws-amplify";
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
import { User } from "../../models";

// import { Users } from "../../types";

const Logo = styled.img`
  display: flex;
  margin: auto;
  /* PET_FINAL logo 1 */
  width: 150px;
`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // const [verifiedEmail, setVerifiedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  // const [users, setUserModels] = useState<User[]>([]);
  // Initialize a boolean state
  const [passwordShown, setPasswordShown] = useState(false);
  // const [currentUser, setCurrentUser] = useState<User[]>([]);
  // const [userName] = useContext(email);
  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  async function signIn() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user } = await Auth.signIn({
        username: email,
        password,
      });

      const posts = await DataStore.query(User, (c) => c.userName.eq(email));
      setUser(posts as User[]);

      navigate("/");
    } catch (errore) {
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
          type="text"
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
