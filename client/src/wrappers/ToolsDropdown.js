import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;

  .dropdown-button {
    background: transparent;
    border-color: transparent;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .dropdown {
    position: absolute;
    width: 100%;
    text-align: left;
    visibility: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .show-dropdown {
    visibility: visible;
  }

  .menu-item {
    border-radius: 0;
    height: 0.5rem;
    width: 100%;
    margin-top: 0;
    margin-bottom: 1rem;
    padding: 0;
  }
`;

export default Wrapper;
