import mongoose from 'mongoose';
import { mongoUrl } from '../utils/environmentVariables';
import { apiVersionBaseUrl } from '../common/api';

beforeAll(async () => {
  await mongoose.connect(mongoUrl);
});

beforeEach(async () => {
  await truncateDb();
});

afterAll(async () => {
  await truncateDb();
  await mongoose.connection.close();
});

async function truncateDb() {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}

export function makeUrl(url) {
  return `${apiVersionBaseUrl}${url}`;
}

export function makeMockJukebox() {
  const name = 'dust';
  const code = 'dust';
  const spotifyCode = '';
  const role = 'starter';
  return { name: name, code: code, spotifyCode: spotifyCode, role: role };
}

export const oneTrackQueue = [
  {
    id: '6tlRgNME7ULlY5OcvRdgYn',
    uri: 'spotify:track:6tlRgNME7ULlY5OcvRdgYn',
    name: 'Radio',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b2737d7f95b8b75403754f8e7104',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e027d7f95b8b75403754f8e7104',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d000048517d7f95b8b75403754f8e7104',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
        },
        href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
        id: '6xTk3EK5T9UzudENVvu9YB',
        name: 'Rancid',
        type: 'artist',
        uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
      },
    ],
    duration_ms: 171333,
    _id: '67a208341980c2ea1dfd5549',
  },
];

export const multiTrackQueue1 = [
  {
    id: '3a0PmAzfzQfCZFGWkqQ2vi',
    uri: 'spotify:track:3a0PmAzfzQfCZFGWkqQ2vi',
    name: 'Red Hot Moon',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851b4d6e44a1a58a9bdcd1edee7',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
        },
        href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
        id: '6xTk3EK5T9UzudENVvu9YB',
        name: 'Rancid',
        type: 'artist',
        uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
      },
    ],
    duration_ms: 216001,
    _id: '67a20bcb6f170b037d7565ea',
  },
  {
    id: '3prgCqodybVT758HNY2SXW',
    uri: 'spotify:track:3prgCqodybVT758HNY2SXW',
    name: 'I Wanna Riot',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273e1609e90aee6dcb740806c39',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02e1609e90aee6dcb740806c39',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851e1609e90aee6dcb740806c39',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
        },
        href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
        id: '6xTk3EK5T9UzudENVvu9YB',
        name: 'Rancid',
        type: 'artist',
        uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
      },
    ],
    duration_ms: 191666,
    _id: '67a20bcb6f170b037d7565eb',
  },
  {
    id: '3pdHJCTk85ls2SGGXIJ7XH',
    uri: 'spotify:track:3pdHJCTk85ls2SGGXIJ7XH',
    name: 'Fall Back Down',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851b4d6e44a1a58a9bdcd1edee7',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
        },
        href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
        id: '6xTk3EK5T9UzudENVvu9YB',
        name: 'Rancid',
        type: 'artist',
        uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
      },
    ],
    duration_ms: 223227,
    _id: '67a20bcb6f170b037d7565ec',
  },
];

export const multiTrackQueue1Reordered = [
  {
    id: '3prgCqodybVT758HNY2SXW',
    uri: 'spotify:track:3prgCqodybVT758HNY2SXW',
    name: 'I Wanna Riot',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273e1609e90aee6dcb740806c39',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02e1609e90aee6dcb740806c39',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851e1609e90aee6dcb740806c39',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
        },
        href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
        id: '6xTk3EK5T9UzudENVvu9YB',
        name: 'Rancid',
        type: 'artist',
        uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
      },
    ],
    duration_ms: 191666,
    _id: '67a20bcb6f170b037d7565eb',
  },
  {
    id: '3a0PmAzfzQfCZFGWkqQ2vi',
    uri: 'spotify:track:3a0PmAzfzQfCZFGWkqQ2vi',
    name: 'Red Hot Moon',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851b4d6e44a1a58a9bdcd1edee7',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
        },
        href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
        id: '6xTk3EK5T9UzudENVvu9YB',
        name: 'Rancid',
        type: 'artist',
        uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
      },
    ],
    duration_ms: 216001,
    _id: '67a20bcb6f170b037d7565ea',
  },
  {
    id: '3pdHJCTk85ls2SGGXIJ7XH',
    uri: 'spotify:track:3pdHJCTk85ls2SGGXIJ7XH',
    name: 'Fall Back Down',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02b4d6e44a1a58a9bdcd1edee7',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851b4d6e44a1a58a9bdcd1edee7',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/6xTk3EK5T9UzudENVvu9YB',
        },
        href: 'https://api.spotify.com/v1/artists/6xTk3EK5T9UzudENVvu9YB',
        id: '6xTk3EK5T9UzudENVvu9YB',
        name: 'Rancid',
        type: 'artist',
        uri: 'spotify:artist:6xTk3EK5T9UzudENVvu9YB',
      },
    ],
    duration_ms: 223227,
    _id: '67a20bcb6f170b037d7565ec',
  },
];
