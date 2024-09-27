import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
const spotifySearchUrl = 'https://api.spotify.com/v1/search';
const spotifyArtistUrl = 'https://api.spotify.com/v1/artists';
const spotifyAlbumUrl = 'https://api.spotify.com/v1/albums';

async function getAccessToken(params) {
  var data = {
    grant_type: 'client_credentials',
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
  };
  var options = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  const response = await axios.post(spotifyTokenUrl, data, options);
  return response.data.access_token;
}

async function search(searchString) {
  return await axios.get(spotifySearchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { q: searchString, type: 'artist,album,track' },
  });
}

const mock_user_artist_search = 'rancid';
var accessToken = await getAccessToken();
var searchResults = await search(mock_user_artist_search);
const artists = searchResults.data.artists.items;
const artist = artists.filter((artist) => artist.name.toLowerCase() === mock_user_artist_search)[0];
const artistId = artist.id;

var res = await axios.get(`${spotifyArtistUrl}/${artistId}/albums`, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
var albums = res.data.items.filter((album) => {
  return album.artists.length === 1 && album.artists[0].name.toLowerCase() === mock_user_artist_search;
});

var songs = [];
for (let album of albums) {
  var res = await axios.get(`${spotifyAlbumUrl}/${album.id}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  songs = [...songs, ...res.data.items];
}

for (let song of songs) {
  console.log(song.name);
}
