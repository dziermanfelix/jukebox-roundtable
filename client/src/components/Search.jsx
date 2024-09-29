import { useState, useEffect } from 'react';
import { searchPath } from '../utils/paths';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { PayloadType } from '../components';

const Search = () => {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      searchRequest(value);
    }, 750);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const searchRequest = async () => {
    if (value != '') {
      try {
        const response = await customFetch.post(searchPath, { search: value });
        setTracks(response.data.tracks.items);
        setArtists(response.data.artists.items);
        setAlbums(response.data.albums.items);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
        return error;
      }
    } else {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
    }
  };

  return (
    <div>
      <label htmlFor='search'> search </label>
      <input type='text' value={value} onChange={handleChange} />
      {tracks.length > 0 && <PayloadType items={tracks} setter={setTracks} />}
      {artists.length > 0 && <PayloadType items={artists} setter={setArtists} />}
      {albums.length > 0 && <PayloadType items={albums} setter={setAlbums} />}
    </div>
  );
};
export default Search;
