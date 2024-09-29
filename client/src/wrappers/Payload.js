import styled from 'styled-components';

const Wrapper = styled.section`
  .image-container {
    width: 75vw;
    vertical-align: middle;
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    flex-direction: row;
    justify-content: space-around;
    padding: 1rem;
    height: 105px;
  }
  .bigger-container {
    height: 180px;
  }
  .image {
    text-align: center;
    padding: 1px;
    font-size: 8px;
    background: white;
    display: inline-block;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 105px;
    width: 105px;
  }
  .bigger-image {
    height: 180px;
    width: 180px;
  }
  .track {
    border-style: solid;
    border-color: red;
  }
`;

export default Wrapper;
