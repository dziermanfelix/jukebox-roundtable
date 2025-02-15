import styled from 'styled-components';

const Wrapper = styled.section`
  margin: 0;
  position: absolute;
  top: 30%;
  left: 50%;
  -ms-transform: translate(-50%, -30%);
  transform: translate(-50%, -30%);
  text-align: center;

  h1 {
    text-transform: capitalize;
  }

  button {
    margin: 0.5em 0.5em;
  }

  .form {
    padding: 0.2rem 0.2rem;
    margin: 0.2rem auto;
  }

  .form-row {
    margin-bottom: 0.1rem;
  }

  .form-label {
    margin-bottom: 0.75rem;
    margin-right: 0.2rem;
    text-transform: capitalize;
    line-height: 1.5;
  }

  .form-input {
    padding: 0.375rem 0.75rem;
  }
`;

export default Wrapper;
