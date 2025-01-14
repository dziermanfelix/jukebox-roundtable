import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  width: 90vw;
  height: 90vh;
  justify-content: center;
  overflow: hidden;
  .search {
    display: flex;
    flex-direction: row;
    width: 50%;
    height: 95%;
  }
  .queue-and-player {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
  }
`;

export default Wrapper;
