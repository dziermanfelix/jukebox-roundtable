import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  .data {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: .1rem;;
  }
  .queue {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export default Wrapper;
