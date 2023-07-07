import styled from "styled-components";
import { Link } from "react-router-dom";
import { Modal } from "@mui/material";
import "@fontsource/rubik";
import "@fontsource/roboto";

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4%;
`;

const Box = styled.section`
  border: solid 0.5px #c4c4c4;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  font-family: "Rubik", sans-serif;
  background: white;
  width: 35%;
  padding: 3rem 5rem;

  @media (max-width: 500px) {
    border: none;
    box-shadow: none;
    display: flex;
    margin-top: 30%;
    padding: 0;
    width: 100%;
  }
`;

const Header = styled.p`
  display: flex;
  cursor: text;
  margin: 1.5rem 0rem;

  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 40px;
  color: #011338;
  @media (max-width: 500px) {
    font-family: "Rubik";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const CenteredHeader = styled.p`
  cursor: text;
  margin: 1.5rem 0rem;

  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 40px;
  color: #011338;
  text-align: center;
  @media (max-width: 500px) {
    font-family: "Rubik";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    align-self: center;
  }
`;

const Button = styled.button`
  background: #1b4c5a;
  border: solid 0.5px #6c6b6b;
  color: white;
  height: 2.8rem;
  margin-top: 2rem;
  font-weight: bold;
  width: 100%;
  align-self: center;
  cursor: pointer;
`;

const BackArrow = styled.img`
  position: absolute;
  top: 5%;
  left: 4%;
  cursor: pointer;
  @media (max-width: 500px) {
    width: 34px;
    top: 7%;
    left: 7%;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 3rem;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid rgba(143, 143, 143, 0.6);
  @media (max-width: 500px) {
    height: 2rem;
  }
`;

const Description = styled.p`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  color: #000d26;
  text-align: left;
  padding-bottom: 20px;
`;

const CenteredDescription = styled.p`
  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  color: #000d26;
  text-align: center;
  padding-bottom: 20px;
`;

const Label = styled.p`
  font-size: 18px;
`;

const PasswordContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
`;

const EyeSlash = styled.img`
  cursor: pointer;
  position: absolute;
  align-self: center;
  padding-right: 5px;
`;

const Question = styled.p`
  position: relative;
  font-size: 0.9rem;
  right: 5px;
  top: 100%;
  padding-top: 10px;
  text-align: right;
`;

const TextLink = styled(Link)`
  font-weight: bold;
  color: black;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  background: none;
  border: none;
  margin-left: auto;
  padding-top: 10px;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  flex: content;
  height: 8%;
  padding: 3%;
  border: 2px solid #d03d3d;
  align-content: stretch;
  text-align: center;
  vertical-align: middle;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const PopupDiv = styled(Modal)`
  padding-left: 14px;
  padding-right: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PopupBox = styled.div`
  width: 70rem;
  height: auto;
  background: #ffffff;
  border: none;
`;
const X = styled.img`
  width: 2rem;
  height: 2rem;
  padding: 2rem;
  cursor: pointer;
`;

const CancelBtn = styled.button`
  background-color: white;
  border: 4px solid #1b4c5a;
  color: #1b4c5a;
  font-family: "Rubik";
  font-weight: 700;
  font-size: 16pt;
  width: 250px;
  height: 60px;
  cursor: pointer;
`;

const SaveBtn = styled.button`
  background-color: #1b4c5a;
  color: white;
  border: 4px solid #1b4c5a;
  font-family: "Rubik";
  font-weight: 700;
  font-size: 16pt;
  width: 250px;
  height: 60px;
  cursor: pointer;
`;

export {
  Wrapper,
  Box,
  Header,
  CenteredHeader,
  Button,
  BackArrow,
  Input,
  Description,
  CenteredDescription,
  Label,
  PasswordContainer,
  EyeSlash,
  Question,
  TextLink,
  ErrorMessage,
  Row,
  PopupDiv,
  PopupBox,
  X,
  CancelBtn,
  SaveBtn,
};
