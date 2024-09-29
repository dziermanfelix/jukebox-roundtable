import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { writeAccessToken, readAccessToken } from '../utils/file.cjs';

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
const spotifySearchUrl = 'https://api.spotify.com/v1/search';
const spotifyAlbumUrl = 'https://api.spotify.com/v1/albums';
const spotifyArtistUrl = 'https://api.spotify.com/v1/artists';

// TODO figure out how to know when to refresh the token
// TODo figure out how to refresh the token, I think I just comment out that refresh_token part
export const getAccessToken = async () => {
  let accessToken = await readAccessToken();
  if (accessToken === '') {
    accessToken = await refreshAccessToken();
  }
  return accessToken;
};

export const refreshAccessToken = async () => {
  var data = {
    grant_type: 'client_credentials',
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
  };
  var options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  const response = await axios.post(spotifyTokenUrl, data, options);
  const accessToken = response.data.access_token;
  writeAccessToken(accessToken);
  return accessToken;
};

export const searchSpotify = async (req, res) => {
  let accessToken = await getAccessToken();
  const searchString = req.body.search;
  let results = {};
  try {
    results = await getSearchResults(searchString, accessToken);
  } catch (error) {
    if (error.status === 401) {
      accessToken = await refreshAccessToken();
      results = await getSearchResults(searchString, accessToken);
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
