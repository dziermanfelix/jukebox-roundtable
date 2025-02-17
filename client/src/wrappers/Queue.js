import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  height: 75%;
  text-align: left;
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-radius: 10px;
  overflow-x: hidden;
  overflow-y: scroll;

  .queue {
    margin: 0.2rem;
    overflow-y: scroll;
    overflow-x: hidden;
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
    overflow: hidden;
    font-size: 16px;
  }

  .queue-tools {
    margin-left: auto;
    margin-right: 0.5rem;
    opacity: 0;
  }

  .queue-tools:hover {
    opacity: 1;
  }

  .tool-button {
    width: '50px';
    height: '50px';
    padding: 0;
    margin-left: 0.2rem;
    display: 'flex';
    justify-content: 'center';
    align-items: 'center';
    font-size: '16px';
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
