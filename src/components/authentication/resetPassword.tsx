/* eslint-disable no-console */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import eyeSlash from "../../images/eyeSlash.svg";
import eye from "../../images/eye.svg";
import backArrow from "../../images/backArrow.png";
import {
  BackArrow,
  Box,
  Button,
  Description,
  ErrorMessage,
  EyeSlash,
  Header,
  Input,
  Label,
  PasswordContainer,
  Wrapper,
} from "../styledComponents";

// email prop that is set in forgot-password page
type EmailProps = {
  email: string;
};

export default function ResetPassword({ email }: EmailProps) {
  const [passwordShown, setPasswordShown] = useState(true);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(true);
  const [errorReal, setErrorReal] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // passwordShown toggle handler
  const togglePassword = () => {
    // When the handler is invoked inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  // confirmPasswordShown toggle handler
  const toggleConfirmPassword = () => {
    // When the handler is invoked inverse the boolean state of passwordShown
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  /**
   * This function is run ewhen the user clicks the Submit button, if will check that the user has submitted two
   * valid and matching passwords as well as the code sent to their emails. Once all these checks pass it will
   * run the Auth request to reset the users password. Any errors along the way will be caught and displayed.
   */
  const handleSubmit = async () => {
    setErrorReal("");

    // Uses a password regex that checks it is at least 8 characters long, has one uppercase, lowercase, number,
    // and special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorReal(
        "Password needs at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      return;
    }

    // if the passwords don't match then set an error message
    if (confirmPassword !== password) {
      setErrorReal("Passwords do not match");
      return;
    }

    // If the user has entered a code then send the Auth Request to reset their password the navigate to the
    // success page, if something goes wrong then print error message.
    if (code.length > 0) {
      try {
        await Auth.forgotPasswordSubmit(email, code, password);
        navigate("/success/reset", { replace: true });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("error signing up:", err);
        if (err instanceof Error) {
          setErrorReal(err.message);
        } else {
          setErrorReal(String(err));
          navigate("/success/reset", { replace: true });
        }
      }
    }
  };

  // Navigates the user back to the login page if they click the back arrow
  const handleBackClick = () => {
    navigate("/login");
  };

  return (
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
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Label>New Password</Label>
        <PasswordContainer>
          {/* if passwordShown is true then change type to text */}
          <Input
            type={passwordShown ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordShown ? (
            <EyeSlash onClick={togglePassword} src={eye} />
          ) : (
            <EyeSlash onClick={togglePassword} src={eyeSlash} />
          )}
        </PasswordContainer>
        <Label>Confirm New Password</Label>
        <PasswordContainer>
          <Input
            type={confirmPasswordShown ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPasswordShown ? (
            <EyeSlash onClick={toggleConfirmPassword} src={eye} />
          ) : (
            <EyeSlash onClick={toggleConfirmPassword} src={eyeSlash} />
          )}
        </PasswordContainer>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Wrapper>
  );
}
