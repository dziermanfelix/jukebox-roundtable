import Wrapper from '../wrappers/Payload';

const Payload = ({ payload, line1, line2, imageUrl, onClick, className }) => {
  return (
    <Wrapper>
      <div>
        <button className={'image ' + className} onClick={() => onClick(payload)}>
          <img src={imageUrl} alt='' />
          <p>{line1}</p>
          <p>{line2}</p>
        </button>
      </div>
    </Wrapper>
  );
};
export default Payload;
