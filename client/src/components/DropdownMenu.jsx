import { useEffect, useRef, useState } from 'react';
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
    <div ref={dropDownRef} className='relative inline-block mr-1'>
      <button
        className='hover:bg-gray-400'
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
      >
        <IoSettingsOutline />
      </button>

      {isMenuOpen && (
        <div className='absolute right-0 mt-1 w-40 shadow-lg rounded bg-black text-white border z-50'>
          <button
            className='w-full text-left px-4 py-2 hover:bg-gray-900'
            onClick={() => {
              setIsDialogOpen(true);
              setIsMenuOpen(false);
            }}
          >
            Edit Name
          </button>
          <button className='w-full text-left px-4 py-2 hover:bg-gray-900' onClick={logoutSession}>
            Logout
          </button>
        </div>
      )}

      {isDialogOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'
          onClick={() => setIsDialogOpen(false)}
        >
          <div className='text-white bg-gray-500 p-50' ref={dialogRef} onClick={(e) => e.stopPropagation()}>
            <h2 className='text-2xl bold mb-3'>Edit Name</h2>
            <input ref={inputRef} className='border rounded' type='text' defaultValue={displayName} />
            <div className='flex mt-4 w-full space-x-2'>
              <button className='rounded p-1 bg-black hover:bg-gray-900' onClick={onSave}>
                Save
              </button>
              <button
                className='rounded p-1 bg-black hover:bg-gray-900'
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
