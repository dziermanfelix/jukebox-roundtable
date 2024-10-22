import styled from 'styled-components';

const Wrapper = styled.section`
  .image-container {
    vertical-align: middle;
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    flex-direction: row;
    justify-content: space-around;
    padding: 1rem;
    min-height: 105px;
  }
  .image {
    text-align: center;
    padding: 3px;
    font-size: 10px;
    background: white;
    display: inline-block;
    overflow-x: hidden;
    overflow-y: hidden;
    min-height: 105px;
    min-width: 105px;
  }
  .track {
    border-style: solid;
    border-color: red;
    border-width: 4px;
  }
`;

export default Wrapper;
