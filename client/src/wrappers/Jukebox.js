import styled from 'styled-components';

const Wrapper = styled.section`
  height: 95vh;
  width: 99vw;

  .tool-bar {
    margin-right: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .center-tool {
    text-transform: capitalize;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
  }

  .right-tool {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
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
    width: 50%;
    height: 100%;
  }

  .right-panel {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
  }

  @media (max-width: 950px) {
    unset width;
    unset height;

    .jukebox {
      flex-direction: column;
      align-items: center;
    }

    .left-panel {
      width: 95%;
      height: fit-content;
      max-height: 55%;

      display: flex;
      flex-direction: column; /* Ensures content stacks at the top */
      align-items: flex-start;
    }

    .right-panel {
      width: 95%;
      height: 50%;
      flex-grow: 1
    }
  }
`;

export default Wrapper;
