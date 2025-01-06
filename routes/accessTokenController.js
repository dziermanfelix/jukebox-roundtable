import AccessToken from '../models/AccessTokenModel.js';
import { StatusCodes } from 'http-status-codes';
import { currentTimeSeconds } from '../utils/time.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';

export const getAccessTokenHttp = async (req, res) => {
  const accessToken = await getAccessToken();
  return res.status(StatusCodes.OK).json({ accessToken });
};

export const getAccessToken = async () => {
  let token = await AccessToken.findOne({ key: 'accessToken' });
  if (token) {
    if (currentTimeSeconds() >= token.expiresAt) {
      return refreshAccessToken();
    }
    return token.access_token;
  } else {
    return refreshAccessToken();
  }
};

export const refreshAccessToken = async () => {
  var data = {
    grant_type: 'client_credentials',
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
    scope:
      'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify',
  };
  var options = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  const response = await axios.post(spotifyTokenUrl, data, options);
  const accessToken = response.data.access_token;
  setAccessToken(response.data);
  return accessToken;
};

export const setAccessToken = async (data) => {
  data.key = 'accessToken';
  data.expiresAt = currentTimeSeconds() + data.expires_in;
  await AccessToken.replaceOne({ key: 'accessToken' }, data, {
    upsert: true,
  });
};
