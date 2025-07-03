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
    margin-left: 0.4rem;
    justify-content: flex-start;
    color: grey;
  }

  .right-tool {
    justify-content: flex-end;
    margin-right: 0.4rem;
  }

  .fixed-tool {
    flex-shrink: 0;
    white-space: nowrap;
  }
`;

export default Wrapper;
