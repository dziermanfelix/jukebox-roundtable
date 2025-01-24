import styled from 'styled-components';

const Wrapper = styled.section`
  height: 100vh;
  width: 100vw;
  .jukebox {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    justify-content: center;
    overflow: hidden;
  }
  .left-panel {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
  }
  .right-panel {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
  }
`;

export default Wrapper;
