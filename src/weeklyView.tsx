import styled from "styled-components";
import { range } from "./components/utils";
import { colprops } from "./components/colprops";
import { rowprops } from "./components/rowprops";
const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

const Wrapper = styled.div`
  width: calc(100% - 30px);
  border: 1px solid;
  margin: 15px;
`;
const HGrid = styled.image<colprops>`
  first: ${(p) => p.first};
  cols: ${(p) => p.cols};
  display: grid;
  grid-template-columns: ${({ p }) => p.first || ""} repeat(
      ${({ cols }) => p.cols},
      1fr
    );
`;

const HGrid = styled.div``;

const VGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(${({ rows }) => rows}, 1fr);
`;

export const WeeklyView = () => {
  return (
    <>
      <Wrapper>
        <HGrid first={"30px"} cols={1}>
          <VGrid rows={24}>
            {range(24).map((day) => (
              <p>{day}</p>
            ))}
          </VGrid>
          <HGrid cols={7}>
            {DAYS.map(() => (
              <p>{day}</p>
            ))}
          </HGrid>
        </HGrid>
      </Wrapper>
    </>
  );
};
