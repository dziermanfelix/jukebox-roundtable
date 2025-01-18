import { useState, useEffect, useRef } from 'react';
import Wrapper from '../wrappers/DebouncingText';

const DebouncingText = ({ initialValue, updater }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const timeout = setTimeout(() => {
        updateValue(value);
      }, 750);
      return () => clearTimeout(timeout);
    } else {
      isMounted.current = true;
    }
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

  return (
    <Wrapper>
      {isEditing ? (
        <div>
          <input type='text' value={value} onChange={onChange} onKeyDown={handleKeyPress} />
        </div>
      ) : (
        <div>
          <input type='text' value={value} readOnly onClick={() => setIsEditing(true)} />
        </div>
      )}
    </Wrapper>
  );
};

export default DebouncingText;
