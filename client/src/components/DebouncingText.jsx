import { useState, useEffect } from 'react';
import Wrapper from '../wrappers/DebouncingText';

const DebouncingText = ({ initialValue, updater, keepEditing }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateValue(value);
    }, 750);
    return () => clearTimeout(timeout);
  }, [value]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      updateValue(e.target.value);
    }
  };

  const updateValue = (value) => {
    updater(value);
    setIsEditing(false);
  };

  const getRender = () => {
    if (isEditing) {
      return <input type='text' value={value} onChange={onChange} onKeyDown={handleKeyPress} />;
    } else {
      if (keepEditing) {
        return <input type='text' value={value} onChange={onChange} onKeyDown={handleKeyPress} />;
      } else {
        return <span onClick={() => setIsEditing(true)}>{value} </span>;
      }
    }
  };

  return <Wrapper>{<div>{getRender()}</div>}</Wrapper>;
};

export default DebouncingText;
