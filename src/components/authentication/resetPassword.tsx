/* eslint-disable no-console */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import eyeSlash from "../../images/eyeSlash.svg";
import eye from "../../images/eye.svg";
import backArrow from "../../images/backArrow.png";

import {
  Wrapper,
  Box,
  BackArrow,
  Button,
  Header,
  Input,
  Description,
  Label,
  PasswordContainer,
  EyeSlash,
  ErrorMessage,
} from "../styledComponents";

// email prop that is set in forgot password page
type EmailProps = {
  email: string;
};

export default function ResetPassword({ email }: EmailProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
    code: "",
  });
  const [passwordShown, setPasswordShown] = useState(true);
  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  const [passwordShown1, setPasswordShown1] = useState(true);
  // Password toggle handler
  const togglePassword1 = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown1(!passwordShown1);
  };

  // helper function for validating the input
  const [errorReal, setErrorReal] = useState("");

  const onInputChange = (e: { target: any }) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // changes windows to different pages
  const handleClick = async () => {
    setErrorReal("");
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // checking if password reaches requirements when user hits submit
    if (!passwordRegex.test(input.password)) {
      setErrorReal(
        "Password needs at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      return;
    }
    // checking if the passwords match
    if (input.confirmPassword !== input.password) {
      setErrorReal("Passwords do not match");
    }
    // checking if password matches and code is filled out
    if (input.confirmPassword === input.password && input.code.length > 0) {
      // Collect confirmation code and new password, then
      // try to send request and catch any errors or if no errors nav to success page
      try {
        await Auth.forgotPasswordSubmit(email, input.code, input.password)
          // eslint-disable-next-line no-console
          .then((data) => console.log(data));
        navigate("/success/reset", { replace: true });
      } catch (errore) {
        // eslint-disable-next-line no-console
        console.log("error signing up:", errore);
        // setting the error message to be displayed on frontend if there is an error message
        if (errore instanceof Error) {
          setErrorReal(errore.message);
        } else {
          setErrorReal(String(errore));
          navigate("/success/reset", { replace: true });
        }
      }
    }
  };
  const handleBackClick = () => {
    navigate("/login");
  };

  return (
    // wrapper centers everything it wraps
    <Wrapper>
      <BackArrow src={backArrow} alt="didn't work" onClick={handleBackClick} />
      <Box>
        <Header>Create New Password</Header>
        <Description>
          Your new password must be different from previous used passwords
        </Description>
        {/* displays error message when input doesn't meet requirements */}
        {errorReal && <ErrorMessage>{errorReal}</ErrorMessage>}
        <Label>Verification Code</Label>
        <Input
          type="text"
          name="code"
          placeholder="Enter Code"
          value={input.code}
          onChange={(e) =>
            setInput((prev) => ({ ...prev, code: e.target.value }))
          }
          required
        />
        {/* if show password is true then change type to text */}
        <Label>New Password</Label>
        <PasswordContainer>
          <Input
            type={passwordShown ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={input.password}
            onChange={onInputChange}
            required
          />
          {/* changes the truth value of show password */}
          {passwordShown ? (
            <EyeSlash onClick={togglePassword} src={eye} />
          ) : (
            <EyeSlash onClick={togglePassword} src={eyeSlash} />
          )}
        </PasswordContainer>
        <Label>Confirm New Password</Label>
        <PasswordContainer>
          <Input
            type={passwordShown1 ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={input.confirmPassword}
            onChange={onInputChange}
            required
          />
          {passwordShown1 ? (
            <EyeSlash onClick={togglePassword1} src={eye} />
          ) : (
            <EyeSlash onClick={togglePassword1} src={eyeSlash} />
          )}
        </PasswordContainer>
        <Button onClick={handleClick}>Submit</Button>
      </Box>
    </Wrapper>
  );
}
