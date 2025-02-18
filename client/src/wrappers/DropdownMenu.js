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

  .dropdown-button:hover {
    filter: brightness(1.2);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 1px);
    right: 0;
    background: black;
    border: 1px solid gray;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    min-width: 150px;
    display: block;
  }

  .menu-item {
    padding: 10px 15px;
    cursor: pointer;
    display: block;
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
  }

  .dialog-content {
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  input: {
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 15px;
    border-radius: 4px;
    font-size: 16px;
  }

  .button-container: {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .dialog-button: {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  .dropdown-button:hover,
  .menu-item:hover {
    filter: brightness(1.2);
  }
`;

export default Wrapper;
