import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import styled from "styled-components";
import { User } from "../../models";
import eyeSlash from "../../images/eyeSlash.svg";
import eye from "../../images/eye.svg";
import backArrow from "../../images/backArrowIcon.png";
import {
  Box,
  BackArrow,
  Button,
  Header,
  Input,
  Label,
  EyeSlash,
  PasswordContainer,
  Question,
  TextLink,
  ErrorMessage,
  Wrapper,
} from "../styledComponents";

const Select = styled.select`
  box-sizing: border-box;
  border: 1px solid rgba(143, 143, 143, 0.6);
  width: 100%;
  display: flex;
  height: 3rem;
  color: gray;
  font-size: 15px;
  @media (max-width: 500px) {
    height: 2rem;
  }
`;

const NameFields = styled.section`
  display: flex;
  flex-direction: row;
  width: 100%;
  @media (max-width: 500px) {
    flex-direction: column;
    margin-bottom: 0%;
  }
`;

const FirstName = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 5%;
  @media (max-width: 500px) {
    margin-right: 0%;
  }
`;

const LastName = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 5%;
  @media (max-width: 500px) {
    margin-left: 0%;
  }
`;

export default function CreateAccount() {
  const [role, setRole] = useState("none");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function signUp() {
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          given_name: firstName,
          family_name: lastName,
          phone_number: `+1${phoneNumber}`,
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true,
        },
      });

      // add user to Datastore
      await DataStore.save(
        new User({
          userName: email,
          firstName,
          lastName,
          userType: role,
        })
      );
      // eslint-disable-next-line no-console
      console.log(user);
      localStorage.setItem("username", email);
      navigate("/enter-code", { replace: true });
    } catch (errore) {
      // eslint-disable-next-line no-console
      console.log("error signing up:", errore);
      if (errore instanceof Error) {
        setError(errore.message);
      } else {
        setError(String(errore));
      }
    }
  }
  const handleSubmit = () => {
    setError("");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      role === "none"
    ) {
      setError("All fields are required");
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Invalid phone number");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password needs at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      return;
    }
    // Call the API to create an account with email and password
    // if response is ok then navigate
    signUp();
  };

  return (
    <Wrapper>
      <BackArrow
        src={backArrow}
        alt="backArrow"
        onClick={() => navigate("/login")}
      />
      <Box>
        <Header>Create an Account</Header>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Label>I am a:</Label>
        <Select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="none" selected disabled>
            Please Select...
          </option>
          <option value="Volunteer">Volunteer</option>
          <option value="Rider">Rider</option>
        </Select>
        <NameFields>
          <FirstName>
            <Label>First Name</Label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FirstName>
          <LastName>
            <Label>Last Name</Label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </LastName>
        </NameFields>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Label>Phone</Label>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Label>Password</Label>
        <PasswordContainer>
          <Input
            type={passwordShown ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordShown ? (
            <EyeSlash onClick={togglePassword} src={eye} />
          ) : (
            <EyeSlash onClick={togglePassword} src={eyeSlash} />
          )}
        </PasswordContainer>
        <Button onClick={handleSubmit}>Sign Up</Button>
        <Question>
          Already have an account? <TextLink to="/login">Log In</TextLink>
        </Question>
      </Box>
    </Wrapper>
  );
}
