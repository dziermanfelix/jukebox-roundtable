import { useState, useEffect } from 'react';
import { searchPath } from '../utils/paths';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { SEARCH_TYPE } from '../utils/constants';
import Wrapper from '../wrappers/Search';
import { Tracks, Albums } from '../components';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [payload, setPayload] = useState([]);
  const [payloadType, setPayloadType] = useState(SEARCH_TYPE.NONE);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRequest(searchValue);
    }, 750);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchValue(event.target.value);
      searchRequest(searchValue);
    }
  };

  const searchRequest = async () => {
    setIsSearching(true);
    if (searchValue != '') {
      try {
        const response = await customFetch.post(searchPath, { search: searchValue });
        setPayloadType(SEARCH_TYPE.TRACKS);
        setPayload(response.data.tracks.items);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
        return error;
      }
    } else {
      setPayloadType(SEARCH_TYPE.NONE);
      setPayload([]);
    }
    setIsSearching(false);
  };

  const displayPayload = () => {
    if (payloadType === SEARCH_TYPE.TRACKS) {
      return <Tracks tracks={payload} setPayloadType={setPayloadType} setPayload={setPayload} />;
    } else if (payloadType === SEARCH_TYPE.ALBUM) {
      return <Tracks tracks={payload} setPayloadType={setPayloadType} setPayload={setPayload} albumDisplay />;
    } else if (payloadType === SEARCH_TYPE.ARTIST) {
      return <Albums albums={payload} setPayloadType={setPayloadType} setPayload={setPayload} />;
    }
  };

  return (
    <Wrapper>
      <label htmlFor='search'> search </label>
      <input type='text' value={searchValue} onChange={handleChange} onKeyDown={handleKeyPress} />
      <button onClick={searchRequest}>refresh</button>
      {isSearching && <div>searching...</div>}
      <div className='search-results'>{displayPayload()}</div>
    </Wrapper>
  );
};
export default Search;
