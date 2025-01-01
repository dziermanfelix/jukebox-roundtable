import styled from 'styled-components';

const Wrapper = styled.section`
  height: 80%;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 1rem;
  text-align: left;
  margin: 0.1rem;
  border-style: solid;
  .track {
    font-size: 0.75rem;
    display: flex;
    flex-direction: row;
  }
  h3 {
    text-align: center;
  }
`;

export default Wrapper;
