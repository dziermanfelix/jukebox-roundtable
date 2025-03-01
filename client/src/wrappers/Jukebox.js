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
      position: relative;
      font-size: 14px;
  }

  .left-tool,
  .right-tool {
      display: flex;
      flex: 1;
      max-width: 50%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  .left-tool {
    margin-left: .4rem;
    justify-content: flex-start;
    color: grey;
  }

  .right-tool {
      justify-content: flex-end;
      margin-right: .4rem;
  }

  .fixed-tool {
      flex-shrink: 0;
      white-space: nowrap;
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
      flex-direction: column;
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
