import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  overflow: scroll;

  .payload {
    margin: 0.1rem 0.8rem 0.1rem 0.8rem;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .info {
    flex-grow: 1;
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
  }

  .album-btn:hover {
    border-color: silver;
    border-style: solid;
  }

  .album-only {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .album-image {
    height: 3rem;
    width: 3rem;
  }
`;

export default Wrapper;
