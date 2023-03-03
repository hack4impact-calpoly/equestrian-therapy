import styled from "styled-components";
import Monthly from "./monthlyView";
import Weekly from "./weeklyView";
import logo from "../images/PETlogo2.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2% 0 0;
`;
const Logo = styled.img`
  position: absolute;
  right: 2%;
  margin: 2% 4% 0 0;
`;
const CalendarsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flext-start;
  justify-content: center;
  padding: 8% 0 0 0;
`;
const StyledMonthly = styled.div`
  padding: 2% 4% 0 0;
`;

export default function Calendar() {
  return (
    <Wrapper>
      <Logo src={logo} />
      <CalendarsWrapper>
        <StyledMonthly>
          <Monthly />
        </StyledMonthly>
        <Weekly startDate={new Date()} />
      </CalendarsWrapper>
    </Wrapper>
  );
}
