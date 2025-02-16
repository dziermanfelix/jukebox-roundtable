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
    /* margin: .8rem; */
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
    margin: .7rem;
    display: grid;
    justify-content: center;
    align-items: center;
  }

  .album-image {
    width: 150px;
    height: 150px;
  }

  @media (max-width: 950px) {
    .album-image {
      width: 75px;
      height: 75px;
    }
  }
`;

export default Wrapper;
