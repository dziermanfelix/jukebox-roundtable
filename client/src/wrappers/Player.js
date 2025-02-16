import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  height: 25%;
  min-height: 90px;
  margin: 0.1rem;
  border-style: solid;
  border-radius: 10px;

  .playing {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .album-cover {
    margin: 0.7rem;
    display: grid;
    justify-content: center;
    align-items: center;
  }

  .album-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export default Wrapper;
