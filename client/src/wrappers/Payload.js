import styled from 'styled-components';

const Wrapper = styled.section`
  .payload {
    font-size: 0.75rem;
    display: flex;
    flex-direction: row;
  }
  .info {
    flex-grow: 1;
  }
  .add-to-queue {
    font-size: .8rem;
  }
  .add-to-queue:hover {
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
  }
`;

export default Wrapper;
