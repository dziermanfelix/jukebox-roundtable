import styled from 'styled-components';

const Wrapper = styled.section`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  width: 100%;

  .search-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0.3rem 0.4rem 0.3rem 0.4rem;
    padding-bottom: 1px;
  }

  .search-label {
    display: block;
    text-transform: capitalize;
    line-height: 1.5;
    margin: 0.2rem;
  }

  .debounce-input {
    width: 50%;
    padding: 5px;
    margin-right: 0.2rem;
    margin-bottom: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 20px;
  }

  .debounce-button {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    outline: none;
  }

  .search-results {
    margin: 0.5rem;
    overflow: scroll;
    width: 100%;
  }
`;

export default Wrapper;
