import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import { setAccessToken, getAccessToken } from './configController.js';
import dotenv from 'dotenv';
dotenv.config();

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
const spotifySearchUrl = 'https://api.spotify.com/v1/search';
const spotifyAlbumUrl = 'https://api.spotify.com/v1/albums';
const spotifyArtistUrl = 'https://api.spotify.com/v1/artists';

export const latestAccessToken = async () => {
  let accessToken = await getAccessToken();
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
  setAccessToken(accessToken);
  return accessToken;
};

export const searchSpotify = async (req, res) => {
  let accessToken = await latestAccessToken();
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
  let accessToken = await latestAccessToken();
  const results = await axios.get(`${spotifyAlbumUrl}/${req.body.id}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = results.data;
  return res.status(StatusCodes.OK).json({ data });
};

export const getArtist = async (req, res) => {
  let accessToken = await latestAccessToken();
  var results = await axios.get(`${spotifyArtistUrl}/${req.body.id}/albums`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = results.data;
  return res.status(StatusCodes.OK).json({ data });
};
