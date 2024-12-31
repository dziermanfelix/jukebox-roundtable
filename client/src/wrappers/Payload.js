import styled from 'styled-components';

const Wrapper = styled.section`
  .payload {
    font-size: 0.75rem;
    display: flex;
    flex-direction: row;
  }
  .payload-btn {
    flex-grow: 1;
  }
  .payload-btn:hover {
    background: silver;
    color: black;
  }
  .image {
    display: inline-block;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 50px;
    width: 50px;
  }
  .image:hover {
    height: 80px;
    width: 80px;
    /* border-style: solid;
    border-color: silver; */
  }
`;

export default Wrapper;
