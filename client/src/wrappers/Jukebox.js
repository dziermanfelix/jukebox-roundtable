import styled from 'styled-components';

const Wrapper = styled.section`
  height: 100vh;
  width: 98vw;

  .jukebox {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    justify-content: center;
  }

  .left-panel {
    display: flex;
    flex-direction: column;
    width: 55%;
    height: 100%;
  }

  .right-panel {
    display: flex;
    flex-direction: column;
    width: 45%;
    height: 100%;
  }

  .tools {
    margin-right: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: right;
  }
`;

export default Wrapper;
