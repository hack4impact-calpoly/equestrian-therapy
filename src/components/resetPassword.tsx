/* eslint-disable no-console */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import eyeSlash from "../images/eyeSlashIcon.svg";
import eye from "../images/eyeIcon.svg";
import backArrow from "../images/backArrowIcon.png";
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
} from "./styledComponents";

// email prop that is set in forgot password page
type EmailProps = {
  email: string;
};

export default function ResetPassword({ email }: EmailProps) {
  const navigate = useNavigate();
  // useState variables
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showPassword2: false,
    code: "",
  });
  const [errorReal, setErrorReal] = useState("");

  const handleClickShowPassword = () => {
    setInput({ ...input, showPassword: !input.showPassword });
  };
  const handleClickShowPassword2 = () => {
    setInput({ ...input, showPassword2: !input.showPassword2 });
  };
  const onInputChange = (e: { target: any }) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // changes windows to different pages
  const handleClick = async () => {
    // console.log(email);
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
            type={input.showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={input.password}
            onChange={onInputChange}
            required
          />
          {/* changes the truth value of show password */}
          {input.showPassword ? (
            <EyeSlash onClick={handleClickShowPassword} src={eye} />
          ) : (
            <EyeSlash onClick={handleClickShowPassword} src={eyeSlash} />
          )}
        </PasswordContainer>
        <Label>Confirm New Password</Label>
        <PasswordContainer>
          <Input
            type={input.showPassword2 ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={input.confirmPassword}
            onChange={onInputChange}
            required
          />
          {input.showPassword2 ? (
            <EyeSlash onClick={handleClickShowPassword2} src={eye} />
          ) : (
            <EyeSlash onClick={handleClickShowPassword2} src={eyeSlash} />
          )}
        </PasswordContainer>
        <Button onClick={handleClick}>Submit</Button>
      </Box>
    </Wrapper>
  );
}
