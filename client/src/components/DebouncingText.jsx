import { useState, useEffect, useRef } from 'react';
import { CiCircleRemove } from 'react-icons/ci';

const DebouncingText = ({ initialValue, updater, keepEditing, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateValue(value);
    }, 750);
    return () => clearTimeout(timeout);
  }, [value]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      updateValue(e.target.value);
    }
  };

  const clearValue = () => {
    setValue('');
    updateValue('');
    inputRef.current.focus();
  };

  const updateValue = (value) => {
    updater(value);
    setIsEditing(false);
  };

  const getRender = () => {
    if (isEditing || keepEditing) {
      return (
        <div className='relative w-full'>
          <input
            className='w-full p-2 pr-10 rounded border hover:border-blue-500 border-gray-300'
            ref={inputRef}
            type='text'
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
          />
          {value && (
            <button
              type='button'
              onClick={clearValue}
              className='absolute right-2 inset-y-1 text-gray-500 hover:text-red-500'
            >
              <CiCircleRemove size={11} />
            </button>
          )}
        </div>
      );
    } else {
      return <span onClick={() => setIsEditing(true)}>{value} </span>;
    }
  };

  return getRender();
};

export default DebouncingText;
