import { useState } from 'react';
import { accessTokenPath } from '../../../common/paths';

const useAccessToken = (jukeboxName) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const { data } = await customFetch.post(accessTokenPath, { jukebox: jukeboxName });
        setToken(data.accessToken);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg);
      }
    };
    getAccessToken();
  }, [token]);

  return token;
};

export default useAccessToken;
