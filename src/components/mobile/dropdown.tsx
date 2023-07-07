/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import styled from "styled-components";

export const DropdownWrapper = styled.form`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  padding-top: 12px;
  padding-right: 2rem;
`;

export const StyledSelect = styled.select`
  // max-width: 50%;
  width: 130px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #bababa;
  border-radius: 7px;
  height: 30px;
  padding-left: 1rem;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  // margin-left: 50%;
  color: #1b4c5a;
`;

export const StyledOption = styled.option`
  color: ${(props) => (props.selected ? "lightgrey" : "black")};
  // width: 41%;
`;

export const StyledLabel = styled.label`
  // margin-bottom: 1rem;
  // width: 41%;
`;

// export const StyledButton = styled.input`
//   max-width: 50%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   border: solid 2px blue;
//   padding: 0.5rem;
//   border-radius: 1rem;
// `;

export function Dropdown(props: {
  action?: any;
  onChange?: any;
  formLabel?: any;
  children?: JSX.Element[];
}) {
  return (
    <DropdownWrapper action={props.action} onChange={props.onChange}>
      <StyledLabel htmlFor="services">{props.formLabel}</StyledLabel>
      <StyledSelect>{props.children}</StyledSelect>
      {/* <StyledButton type="submit" value={props.buttonText} /> */}
    </DropdownWrapper>
  );
}

export function Option(props: {
  selected: boolean | undefined;
  value: string;
}) {
  return <StyledOption selected={props.selected}>{props.value}</StyledOption>;
}
