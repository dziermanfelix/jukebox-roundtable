import { StatusCodes } from 'http-status-codes';
import { getAccessToken } from './accessTokenController.js';
import axios from 'axios';
import { spotifyAlbumUrl, spotifyArtistUrl, spotifySearchUrl } from '../utils/spotifyEndpoints.js';
import { spotifyRedirectUri, spotifyClientId } from '../utils/environmentVariables.js';
import { spotifyAuthorizeUrl } from '../utils/spotifyEndpoints.js';

export const getSpotifyLoginUrl = (req, res) => {
  const scope =
    'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify';
  const url = `${spotifyAuthorizeUrl}?client_id=${spotifyClientId}&response_type=code&redirect_uri=${spotifyRedirectUri}&scope=${scope}`;
  return res.status(StatusCodes.OK).json({ url: url });
};

export const searchSpotify = async (req, res) => {
  let accessToken = await getAccessToken(req.body.jukebox);
  const searchString = req.body.search;
  let results = {};
  try {
    results = await getSearchResults(searchString, accessToken);
  } catch (error) {
    if (error.status === 401) {
      console.log(`401 error: ${JSON.stringify(error.response.data)}`);
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
