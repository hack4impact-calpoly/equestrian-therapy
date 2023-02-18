import { useState } from "react";
import styled from "styled-components";
import arrow from "./images/Back Arrow.png";

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10%;
  color: #ffffff;
  width: 66rem;
  height: 38rem;
  border: 0.5px solid #c4c4c4;
  @media (max-width: 620px) {
    display: flex;
    border: none;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0;
  }
`;
const TempCalendar = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 620px) {
    display: none;
  }
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 50%;
  height: 100%;
  font-family: "Rubik";
  margin: 10%;
  @media (max-width: 620px) {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0 2% 0 2%;
  }
`;
const MobileHeader = styled.div`
  display: none;
  @media (max-width: 620px) {
    display: flex;
    flex-direction: row;
    margin: 4% 0 0 0;
  }
`;
const BackArrow = styled.img`
  display: none;
  @media (max-width: 620px) {
    display: inline;
    width: 2rem;
    top: 4%;
    left: 4%;
    cursor: pointer;
  }
`;
const Create = styled.text`
  @media (max-width: 620px) {
    font-weight: bold;
    color: #1b4c5a;
    font-size: 1rem;
    margin: 12% 0 0 120%;
  }
`;
const Date = styled.text`
  font-weight: bold;
  color: #1b4c5a;
  font-size: 1.8rem;
  margin: 24% 0 10% 0;
  @media (max-width: 620px) {
    font-size: 1rem;
    font-weight: bold;
    color: #1b4c5a;
    margin: 8% 0 6% 0;
  }
`;
const Time = styled.text`
  font-weight: bold;
  color: #5b5a5a;
  font-size: 1.2rem;
  margin: 0 0 2% 0;
  @media (max-width: 620px) {
    font-size: 0.8rem;
  }
`;
const AlignInputs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
const TimeInput1 = styled.input`
  width: 12rem;
  height: 2rem;
  margin: 0 8% 0 0;
  color: #c4c4c4;
  @media (max-width: 620px) {
    width: 8rem;
    height: 1.5rem;
  }
`;
const ToLabel = styled.text`
  font-size: 1rem;
  color: #5b5a5a;
  @media (max-width: 620px) {
    font-size: 0.8rem;
  }
`;
const CenterLabel = styled.div`
  text-align: center;
`;
const TimeInput2 = styled.input`
  width: 12rem;
  height: 2rem;
  margin: 0 0 0 8%;
  color: #c4c4c4;
  @media (max-width: 620px) {
    width: 8rem;
    height: 1.5rem;
  }
`;
const Repeats = styled.text`
  font-weight: bold;
  color: #5b5a5a;
  font-size: 1.2rem;
  margin: 6% 0 2% 0;
  @media (max-width: 620px) {
    font-size: 0.8rem;
  }
`;
const Select = styled.select`
  width: 11rem;
  height: 2.3rem;
  @media (max-width: 620px) {
    width: 8rem;
    height: 1.5rem;
  }
`;
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 12% 0 0 0;
  @media (max-width: 620px) {
    margin: 4% 0 0 0;
  }
`;
const Cancel = styled.button`
  background-color: #ffffff;
  border-color: #1b4c5a;
  color: #1b4c5a;
  cursor: pointer;
  width: 13rem;
  height: 3rem;
  font-size: 1.25rem;
  margin: 0 2rem 0 0;
  @media (max-width: 620px) {
    display: none;
  }
`;
const Save = styled.button`
  background-color: #1b4c5a;
  color: #ffffff;
  border: none;
  cursor: pointer;
  width: 13rem;
  height: 3rem;
  font-size: 1.25rem;
  @media (max-width: 620px) {
    height: 2.2rem;
    font-size: 0.8rem;
  }
`;
const Mess = styled.p`
  color: red;
`;

function addAvailability() {
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");

  const cancelAvail = () => {
    setTime1("");
    setTime2("");
    setRepeat("");
  };
  const saveAvail = () => {
    if ((!time1 && !time2) || repeat === "") {
      setError("All fields are required.");
    } else setError("");
  };

  return (
    <Div>
      <TempCalendar />
      <Form>
        <MobileHeader>
          <BackArrow src={arrow} />
          <Create>Create</Create>
        </MobileHeader>
        <Date>Tuesday, January 11</Date>
        <Time>Time</Time>
        <AlignInputs>
          <TimeInput1
            type="time"
            id="time"
            value={time1}
            onChange={(e) => setTime1(e.target.value)}
          />
          <CenterLabel>
            <ToLabel>to</ToLabel>
          </CenterLabel>
          <TimeInput2
            type="time"
            id="time"
            value={time2}
            onChange={(e) => setTime2(e.target.value)}
          />
        </AlignInputs>
        <Repeats>Repeats</Repeats>
        <Select
          id="repeat"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
        >
          <option value="" selected>
            {" "}
          </option>
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
        <Mess>{error}</Mess>
        <Buttons>
          <Cancel onClick={cancelAvail}>Cancel</Cancel>
          <Save onClick={saveAvail}>Save</Save>
        </Buttons>
      </Form>
    </Div>
  );
}

export default addAvailability;
