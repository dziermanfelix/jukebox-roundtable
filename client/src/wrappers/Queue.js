import styled from 'styled-components';

const Wrapper = styled.section`
  height: 80%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  text-align: left;
  margin: 0.1rem;
  border-style: solid;
  border-radius: 25px;

  .queue {
    margin: 0.8rem 0.5rem;
  }

  .list-item {
    width: 100%;
    padding: 0.5rem;
    margin: 0.2rem;
    cursor: grab;
    border-color: black;
    border-style: solid;
    border-radius: 25px;
    border: 1px solidrgb(11, 18, 2);
    align-items: center;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
  }

  .info {
    width: 100%;
    overflow: hidden;
    font-size: 16px;
  }

  .queue-tools {
    margin-left: auto;
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
`;

export default Wrapper;
