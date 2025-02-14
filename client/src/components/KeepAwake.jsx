import useWakeLock from 'react-use-wake-lock';
import { useEffect, useRef } from 'react';

const KeepAwake = () => {
  const { isSupported, isLocked, request, release } = useWakeLock();
  const isLockedRef = useRef(false);

  useEffect(() => {
    if (isSupported && !isLocked && !isLockedRef.current) {
      request();
      isLockedRef.current = true;
    } else if (isLocked) {
      release();
      isLockedRef.current = false;
    }
  }, []);

  return;
};

export default KeepAwake;
