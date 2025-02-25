import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-radius: 10px;
  overflow: scroll;

  .queue {
    margin: 0.2rem;
    overflow: scroll;
  }

  .list-item {
    padding: 0.5rem;
    margin: 0.2rem;
    cursor: grab;
    border-color: black;
    border-style: solid;
    border-radius: 10px;
    border: 1px solidrgb(11, 18, 2);
    align-items: center;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
  }

  .info {
    overflow: scroll;
    font-size: 16px;
  }

  .queue-tools {
    margin-left: auto;
    margin-right: 0.5rem;
    opacity: 0;
    display: flex;
    flex-direction: row;
  }

  .queue-tools:hover {
    opacity: 1;
  }

  .tool-button {
    width: 25px;
    height: 25px;
    padding: 0;
    margin-left: 0.2rem;
  }

  h3 {
    text-align: center;
  }

  @media (max-width: 500px) {
    .list-item {
      overflow-x: scroll;
      margin-right: 2rem;
    }
    .queue-tools {
      opacity: 1;
    }
  }
`;

export default Wrapper;
