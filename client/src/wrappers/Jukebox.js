import styled from 'styled-components';

const Wrapper = styled.section`
  width: 98vw;
  height: 97vh;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  .data {
    display: flex;
    flex-direction: row;
    width: 60%;
    height: 100%;
    padding: 0.1rem;
  }
  .queue {
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export default Wrapper;
