import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import x from "../../images/X.svg";

const StyledModal = styled(Modal)`
  padding-left: 14px;
  padding-right: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledBox = styled.div`
  width: 70rem;
  height: 871px;
  background: #ffffff;
  border: none;
`;
const X = styled.img`
  width: 2rem;
  height: 2rem;
  padding: 2rem;
  cursor: pointer;
`;
const TempButton = styled.button`
  position: absolute;
  top: 10%;
  left: 40%;
`;

export default function Popup() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
    setOpen(false);
  };

  return (
    <div>
      <TempButton onClick={() => setOpen(true)}>Open popup</TempButton>
      <StyledModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <X src={x} onClick={handleClick} />
        </StyledBox>
      </StyledModal>
    </div>
  );
}
