import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;

  h1 {
    text-transform: capitalize;
  }

  button {
    margin-top: 0.2rem;
  }

  .form {
    background-color: gray;
    max-width: 500px;
    width: 90vw;
    padding: 0.5rem 0.5rem;
    margin: 0.2rem auto;
    display: flex;
    flex-direction: column;
  }

  .form-row {
    margin: 0;
    width: 100%;
    text-align: left;
  }

  .form-label {
    display: block;
    margin-bottom: 0;
    text-transform: capitalize;
    line-height: 1.5;
  }

  .form-input {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 20px;
  }
`;

export default Wrapper;
