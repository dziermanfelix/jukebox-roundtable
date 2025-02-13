import { useEffect } from 'react';

const StayAwake = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        document.title = 'Active';
      } else {
        document.title = 'Inactive';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalId = setInterval(() => {
      console.log('Stay Awake interval...');
      document.title = document.title === 'Active' ? 'Active ' : 'Active';
    }, 120000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  return null;
};

export default StayAwake;
