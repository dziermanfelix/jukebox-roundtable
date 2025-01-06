import styled from 'styled-components';

const Wrapper = styled.section`
  height: 40%;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 1rem;
  text-align: left;
  margin: 0.1rem;
  border-style: solid;
  .list-item {
    font-size: 0.75rem;
    display: flex;
    flex-direction: row;
    cursor: grab;
    border-color: black;
    border-style: solid;
    padding: 0.2rem;
    border-radius: 25px;
    border: 1px solidrgb(11, 18, 2);
    padding: 20px;
  }
  .remove-btn {
    opacity: 0;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    text-align: center;
  }
  .remove-btn:hover {
    opacity: 1;
  }
  h3 {
    text-align: center;
  }
`;

export default Wrapper;
