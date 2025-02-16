import styled from 'styled-components';

const Wrapper = styled.section`
  height: 95vh;
  width: 99vw;

  .tool-bar {
    margin-right: .5rem;
    display: flex;
    flex-direction: row;
    justify-content: right;
  }

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

  @media (max-width: 800px) {
    unset width;
    unset height;

    .jukebox {
      flex-direction: column;
      align-items: center;
    }

    .left-panel {
      width: 95%;
      height: 50%;
    }

    .right-panel {
      width: 95%;
      height: 50%;
    }
  }
`;

export default Wrapper;
