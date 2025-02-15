import { useState, useEffect, useRef } from 'react';
import Wrapper from '../wrappers/DebouncingText';
import { CiCircleRemove } from 'react-icons/ci';

const DebouncingText = ({ initialValue, updater, keepEditing }) => {
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
        <div>
          <input
            className='debounce-input'
            ref={inputRef}
            type='text'
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <button className='debounce-button' onClick={clearValue}>
            <CiCircleRemove />
          </button>
        </div>
      );
    } else {
      return <span onClick={() => setIsEditing(true)}>{value} </span>;
    }
  };

  return <Wrapper>{getRender()}</Wrapper>;
};

export default DebouncingText;
