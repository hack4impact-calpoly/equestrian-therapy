import styled from "styled-components";
import Monthly from "./monthlyView";
import Weekly from "./weeklyView";
import logo from "../images/PETlogo2.svg";
import Toggle from "./adminToggle";
import Popup from "./popup/timeslotPopup";

const Logo = styled.img`
  position: absolute;
  right: 2%;
  margin: 2% 4% 0 0;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 130px;
`;
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px 0 50px;
  gap: 40px;
`;
const RightColumn = styled.div`
  padding-right: 50px;
  width: 100%;
`;

export default function Calendar() {
  return (
    <div>
      <Logo src={logo} />
      <Wrapper>
        <LeftColumn>
          <Monthly />
          <Toggle />
        </LeftColumn>
        <RightColumn>
          <Weekly />
        </RightColumn>
      </Wrapper>
      <Popup />
    </div>
  );
}
