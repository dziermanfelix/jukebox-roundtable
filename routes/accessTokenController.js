import AccessToken from '../models/AccessTokenModel.js';
import { StatusCodes } from 'http-status-codes';
import { currentTimeSeconds } from '../utils/time.js';
import { spotifyTokenUrl } from '../utils/spotifyEndpoints.js';
import { spotifyClientId, spotifyClientSecret, spotifyRedirectUri } from '../utils/environmentVariables.js';
import axios from 'axios';

export const getAccessTokenHttp = async (req, res) => {
  const accessToken = await getAccessToken(req.body.jukebox);
  return res.status(StatusCodes.OK).json({ accessToken });
};

export const initAccessToken = async (jukebox, spotifyCode) => {
  await requestAccessToken(jukebox, spotifyCode);
};

export const getAccessToken = async (jukebox) => {
  let token = await AccessToken.findOne({ jukebox: jukebox });
  if (currentTimeSeconds() >= token.expiresAt) {
    return await refreshAccessToken(token);
  }
  return token.access_token;
};

export const requestAccessToken = async (jukebox, spotifyCode) => {
  var data = {
    grant_type: 'authorization_code',
    code: spotifyCode,
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
    redirect_uri: spotifyRedirectUri,
    scope:
      'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify',
  };
  var options = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  const response = await axios.post(spotifyTokenUrl, data, options);
  setAccessToken(jukebox, response.data);
  return response.data.access_token;
};

export const refreshAccessToken = async (token) => {
  var data = {
    grant_type: 'refresh_token',
    refresh_token: token.refresh_token,
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
  };
  var options = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  const response = await axios.post(spotifyTokenUrl, data, options);
  response.data.refresh_token = token.refresh_token;
  setAccessToken(token.jukebox, response.data);
  return response.data.access_token;
};

export const setAccessToken = async (jukebox, data) => {
  data.jukebox = jukebox;
  data.expiresAt = currentTimeSeconds() + data.expires_in;
  await AccessToken.replaceOne({ jukebox: jukebox }, data, {
    upsert: true,
  });
};
