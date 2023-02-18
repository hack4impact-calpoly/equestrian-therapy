import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import eyeSlash from "../images/eyeSlash.svg";
import backArrow from "../images/backArrow.png";
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
} from "./styledComponents";

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    const phoneRegex = /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Invalid phone number");
      return;
    }

    // Call the API to create an account with email and password
    // if response is ok then navigate
    navigate("/success?from=createAccount");
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeSlash onClick={() => setShowPassword(!showPassword)}>
            <img src={eyeSlash} alt="eyeSlash" />
          </EyeSlash>
        </PasswordContainer>
        <Button onClick={handleSubmit}>Sign Up</Button>
        <Question>
          Already have an account? <TextLink to="/login">Log In</TextLink>
        </Question>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Box>
    </Wrapper>
  );
}
