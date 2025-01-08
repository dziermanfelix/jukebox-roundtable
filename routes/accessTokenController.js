import AccessToken from '../models/AccessTokenModel.js';
import { StatusCodes } from 'http-status-codes';
import { currentTimeSeconds } from '../utils/time.js';
import { spotifyTokenUrl } from '../utils/spotifyEndpoints.js';
import { spotifyClientId, spotifyClientSecret, spotifyRedirectUri } from '../utils/environmentVariables.js';
import axios from 'axios';

export const getAccessTokenHttp = async (req, res) => {
  const accessToken = await getAccessToken();
  return res.status(StatusCodes.OK).json({ accessToken });
};

export const initAccessToken = async (jukebox, spotifyCode) => {
  requestAccessToken(jukebox, spotifyCode);
};

export const getAccessToken = async (jukebox) => {
  let token = await AccessToken.findOne({ key: 'accessToken', jukebox: jukebox });
  if (token) {
    if (currentTimeSeconds() >= token.expiresAt) {
      return refreshAccessToken(jukebox);
    }
    return token.access_token;
  } else {
    return refreshAccessToken(jukebox);
  }
};

export const requestAccessToken = async (jukebox, spotifyCode) => {
  var data = {
    grant_type: 'client_credentials',
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
  const accessToken = response.data.access_token;
  setAccessToken(jukebox, response.data);
  return accessToken;
};

export const refreshAccessToken = async (jukebox) => {
  return null;
};

export const setAccessToken = async (jukebox, data) => {
  data.key = 'accessToken';
  data.jukebox = jukebox;
  data.expiresAt = currentTimeSeconds() + data.expires_in;
  await AccessToken.replaceOne({ key: 'accessToken', jukebox: jukebox }, data, {
    upsert: true,
  });
};
