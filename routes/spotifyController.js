import { StatusCodes } from 'http-status-codes';
import { getAccessToken } from './accessTokenController.js';
import axios from 'axios';

const spotifySearchUrl = 'https://api.spotify.com/v1/search';
const spotifyAlbumUrl = 'https://api.spotify.com/v1/albums';
const spotifyArtistUrl = 'https://api.spotify.com/v1/artists';

export const searchSpotify = async (req, res) => {
  let accessToken = await getAccessToken();
  const searchString = req.body.search;
  let results = {};
  try {
    results = await getSearchResults(searchString, accessToken);
  } catch (error) {
    if (error.status === 401) {
      // TODO might be able to remove this
      // this was here becasue before we could detect a token being expired, we would detect it by a 401 error
      console.log(
        '!! 401 Error in spotifyController.searchSpotify(req, res) ... so we do need to address this case...'
      );
    }
  }
  const data = results.data;
  return res.status(StatusCodes.OK).json({
    accessToken: `${accessToken}`,
    artists: data.artists,
    albums: data.albums,
    tracks: data.tracks,
  });
};

const getSearchResults = async (searchString, accessToken) => {
  return await axios.get(spotifySearchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { q: searchString, type: 'artist,album,track' },
  });
};

export const getAlbum = async (req, res) => {
  let accessToken = await getAccessToken();
  const results = await axios.get(`${spotifyAlbumUrl}/${req.body.id}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = results.data;
  return res.status(StatusCodes.OK).json({ data });
};

export const getArtist = async (req, res) => {
  let accessToken = await getAccessToken();
  var results = await axios.get(`${spotifyArtistUrl}/${req.body.id}/albums`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = results.data;
  return res.status(StatusCodes.OK).json({ data });
};
