import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDropdown } from 'react-icons/io';
import Wrapper from '../wrappers/ToolsDropdown';
import { useJukeboxContext } from '../pages/Jukebox';

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
        <IoIosArrowDropdown />
      </button>
      <div className={showOptions ? 'dropdown show-dropdown' : 'dropdown'}>
        <p>{session.role}</p>
        <button type='button' className='logout-button' onClick={logoutSession}>
          logout
        </button>
      </div>
    </Wrapper>
  );
};

export default ToolsDropdown;
