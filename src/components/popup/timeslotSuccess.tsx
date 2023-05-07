import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../images/horseRider.svg";
import {
  Wrapper,
  SurroundingBoxPopup,
  Button,
  CenteredDescription,
  CenteredHeader,
} from "../styledComponents";

const Logo = styled.img`
  width: 2.5em;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export default function TimeslotSuccess() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <SurroundingBoxPopup>
        <Logo src={logo} />
        <CenteredHeader>Success!</CenteredHeader>
        <CenteredDescription>
          You have successfully made changes to one or more time slots.
        </CenteredDescription>
        <Button onClick={handleClick}>Return to Calendar</Button>
      </SurroundingBoxPopup>
    </Wrapper>
  );
}
