import { useEffect, useRef, useState } from 'react';
import Wrapper from '../wrappers/ToolsDropdown';
import { useJukeboxContext } from '../pages/Jukebox';
import { CiCircleChevDown, CiCircleChevUp } from 'react-icons/ci';

const ToolsDropdown = () => {
  const { session, logoutSession } = useJukeboxContext();
  const [showOptions, setShowOptions] = useState(false);
  const dropDownRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!dropDownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });
  return (
    <Wrapper ref={dropDownRef}>
      <button
        type='button'
        className='dropdown-button'
        onClick={() => {
          setShowOptions(!showOptions);
        }}
      >
        {showOptions ? <CiCircleChevUp /> : <CiCircleChevDown />}
      </button>
      <div className={showOptions ? 'dropdown show-dropdown' : 'dropdown'}>
        <div className='menu-item'>{session.displayName}</div>
        <button type='button' className='menu-item' onClick={logoutSession}>
          logout
        </button>
      </div>
    </Wrapper>
  );
};

export default ToolsDropdown;
