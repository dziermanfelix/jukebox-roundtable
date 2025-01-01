import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  overflow: scroll;
  .payload {
    font-size: 0.75rem;
    display: flex;
    flex-direction: row;
  }
  .info {
    flex-grow: 1;
  }
  .info:hover {
    background: silver;
    color: black;
  }
  .add-to-queue {
    font-size: 0.8rem;
  }
  .add-to-queue:hover {
    background: silver;
    color: black;
  }
  .album-btn {
    overflow: hidden;
    display: grid;
  }
  .album-btn:hover {
    border-color: silver;
    border-style: solid;
  }
  .album-img {
    overflow: hidden;
  }
`;

export default Wrapper;
