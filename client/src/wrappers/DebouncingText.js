import styled from 'styled-components';

const Wrapper = styled.section`
  font-size: 1rem;
  text-align: center;

  input:hover {
    border: 1px solid red;
  }
  input:read-only {
    border: 1px solid blue;
  }
`;

export default Wrapper;
