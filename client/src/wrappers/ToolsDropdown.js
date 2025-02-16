import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;

  .dropdown {
    position: absolute;
    width: 100%;
    text-align: center;
    visibility: hidden;
  }

  .show-dropdown {
    visibility: visible;
  }

  .dropdown-button {
    padding: 0.5rem;
    background: transparent;
    border-color: transparent;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .logout-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default Wrapper;
