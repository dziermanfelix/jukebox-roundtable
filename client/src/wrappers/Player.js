import styled from 'styled-components';

const Wrapper = styled.section`
  height: 20%;
  width: 100%;
  margin: 0.4rem;
  border-style: solid;
  border-radius: 25px;

  .playing {
    margin: 0.7rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .info {
    width: 100%;
  }

  .album-cover {
    margin-left: auto;
  }

  .album-image {
    width: 7rem;
    height: 7rem;
  }
`;

export default Wrapper;
