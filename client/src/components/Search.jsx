import { useState, useEffect } from 'react';
import { searchPath } from '../../../common/paths';
import customFetch from '../../../common/customFetch';
import { toast } from 'react-toastify';
import { SEARCH_TYPE } from '../utils/constants';
import Wrapper from '../wrappers/Search';
import { Tracks, Albums } from '../components';
import { useJukeboxContext } from '../pages/Jukebox';
import { DebouncingText } from '../components';

const Search = () => {
  const { name } = useJukeboxContext();
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [payload, setPayload] = useState([]);
  const [payloadType, setPayloadType] = useState(SEARCH_TYPE.NONE);

  useEffect(() => {
    searchRequest(searchValue);
  }, [searchValue]);

  const searchRequest = async () => {
    setIsSearching(true);
    if (searchValue != '') {
      try {
        const response = await customFetch.post(searchPath, { jukebox: name, search: searchValue });
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
      <div className='search-bar'>
        <label className='search-label' htmlFor='search'>
          {' '}
          search{' '}
        </label>
        <DebouncingText initialValue={searchValue} updater={setSearchValue} keepEditing />
        <button onClick={searchRequest}>refresh search</button>
      </div>
      {isSearching && <div>Searching...</div>}
      {!isSearching && <div className='search-results'>{displayPayload()}</div>}
    </Wrapper>
  );
};

export default Search;
