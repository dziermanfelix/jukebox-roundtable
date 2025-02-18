import { useEffect, useRef, useState } from 'react';
import Wrapper from '../wrappers/DropdownMenu';
import { useJukeboxContext } from '../pages/Jukebox';
import { IoSettingsOutline } from 'react-icons/io5';

const DropDownMenu = () => {
  const { logoutSession, displayName, updateDisplayName } = useJukeboxContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dropDownRef = useRef();
  const dialogRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!dropDownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  useEffect(() => {
    if (isDialogOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.select();
      }, 50);
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDialogOpen(false);
      }
    };

    const handleEnter = (e) => {
      if (e.key === 'Enter' && inputRef.current) {
        onSave();
        setIsDialogOpen(false);
      }
    };

    if (isDialogOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleEnter);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleEnter);
    };
  }, [isDialogOpen]);

  async function onSave() {
    const newDisplayName = inputRef.current.value;
    updateDisplayName(newDisplayName);
    setIsDialogOpen(false);
    setIsMenuOpen(false);
  }

  return (
    <Wrapper ref={dropDownRef}>
      <button
        type='button'
        className='dropdown-button'
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
      >
        <IoSettingsOutline />
      </button>

      {isMenuOpen && (
        <div className='dropdown'>
          <button
            type='button'
            className='menu-item'
            onClick={() => {
              setIsDialogOpen(true);
              setIsMenuOpen(false);
            }}
          >
            Edit Name
          </button>
          <button type='button' className='menu-item' onClick={logoutSession}>
            Logout
          </button>
        </div>
      )}

      {isDialogOpen && (
        <div className='dialog-overlay' onClick={() => setIsDialogOpen(false)}>
          <div className='dialog-content' ref={dialogRef} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: '15px' }}>Edit Name</h2>
            <input ref={inputRef} type='text' defaultValue={displayName} />
            <div className='button-container'>
              <button className='dialog-button' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button className='dialog-button' onClick={onSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default DropDownMenu;
