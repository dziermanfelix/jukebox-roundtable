import mongoose from 'mongoose';
import { mongoUrl } from '../utils/environmentVariables';
import { apiVersionBaseUrl } from '../common/api';
import { app } from '../app';
import request from 'supertest';

export const serverApp = app;
export const serverRequest = request;

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
  },
];

export const q1 = [
  {
    id: '7jm8Fq5juL6aYdQC3aHj83',
    uri: 'spotify:track:7jm8Fq5juL6aYdQC3aHj83',
    name: 'Tomorrow Never Comes',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b2737adf5fda6d4aa68732d534fb',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e027adf5fda6d4aa68732d534fb',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d000048517adf5fda6d4aa68732d534fb',
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
    duration_ms: 145367,
  },
  {
    id: '39uIrqxNaqGlJ8MKAHkyVb',
    uri: 'spotify:track:39uIrqxNaqGlJ8MKAHkyVb',
    name: 'Maxwell Murder',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b27322efa7f978acba74b2c8741a',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e0222efa7f978acba74b2c8741a',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d0000485122efa7f978acba74b2c8741a',
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
    duration_ms: 85863,
  },
];

export const q2 = [
  {
    id: '4uB28m7RAflobYpnLMb6A2',
    uri: 'spotify:track:4uB28m7RAflobYpnLMb6A2',
    name: 'Linoleum',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273b00c510f182b92234ca2b93d',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02b00c510f182b92234ca2b93d',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851b00c510f182b92234ca2b93d',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/4S2yOnmsWW97dT87yVoaSZ',
        },
        href: 'https://api.spotify.com/v1/artists/4S2yOnmsWW97dT87yVoaSZ',
        id: '4S2yOnmsWW97dT87yVoaSZ',
        name: 'NOFX',
        type: 'artist',
        uri: 'spotify:artist:4S2yOnmsWW97dT87yVoaSZ',
      },
    ],
    duration_ms: 130266,
  },
  {
    id: '0eVZhPIexAYqdwKNqSp3Qm',
    uri: 'spotify:track:0eVZhPIexAYqdwKNqSp3Qm',
    name: 'All Outta Angst',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273e3548bc00fbd46743eea0577',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02e3548bc00fbd46743eea0577',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851e3548bc00fbd46743eea0577',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/4S2yOnmsWW97dT87yVoaSZ',
        },
        href: 'https://api.spotify.com/v1/artists/4S2yOnmsWW97dT87yVoaSZ',
        id: '4S2yOnmsWW97dT87yVoaSZ',
        name: 'NOFX',
        type: 'artist',
        uri: 'spotify:artist:4S2yOnmsWW97dT87yVoaSZ',
      },
    ],
    duration_ms: 112493,
  },
];

export const q3 = [
  {
    id: '67HxeUADW4H3ERfaPW59ma',
    uri: 'spotify:track:67HxeUADW4H3ERfaPW59ma',
    name: 'Love Me Two Times',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b27386339e6cd71cc2a167451ee5',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e0286339e6cd71cc2a167451ee5',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d0000485186339e6cd71cc2a167451ee5',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/22WZ7M8sxp5THdruNY3gXt',
        },
        href: 'https://api.spotify.com/v1/artists/22WZ7M8sxp5THdruNY3gXt',
        id: '22WZ7M8sxp5THdruNY3gXt',
        name: 'The Doors',
        type: 'artist',
        uri: 'spotify:artist:22WZ7M8sxp5THdruNY3gXt',
      },
    ],
    duration_ms: 195106,
  },
  {
    id: '7mc2TP4Vzuyw2vNf1bLW9f',
    uri: 'spotify:track:7mc2TP4Vzuyw2vNf1bLW9f',
    name: 'Twentieth Century Fox',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b2735b96a8c5d61be8878452f8f1',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e025b96a8c5d61be8878452f8f1',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d000048515b96a8c5d61be8878452f8f1',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/22WZ7M8sxp5THdruNY3gXt',
        },
        href: 'https://api.spotify.com/v1/artists/22WZ7M8sxp5THdruNY3gXt',
        id: '22WZ7M8sxp5THdruNY3gXt',
        name: 'The Doors',
        type: 'artist',
        uri: 'spotify:artist:22WZ7M8sxp5THdruNY3gXt',
      },
    ],
    duration_ms: 151666,
  },
];

export const q4 = [
  {
    id: '5yKufQqhfr5yQ5HmcqCPTT',
    uri: 'spotify:track:5yKufQqhfr5yQ5HmcqCPTT',
    name: 'In Defense of Dorchester',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273e8adc1ddd7418130d931d8d0',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02e8adc1ddd7418130d931d8d0',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851e8adc1ddd7418130d931d8d0',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/0spqoVkfVzRyAPmA6ZY5F9',
        },
        href: 'https://api.spotify.com/v1/artists/0spqoVkfVzRyAPmA6ZY5F9',
        id: '0spqoVkfVzRyAPmA6ZY5F9',
        name: 'Street Dogs',
        type: 'artist',
        uri: 'spotify:artist:0spqoVkfVzRyAPmA6ZY5F9',
      },
    ],
    duration_ms: 151946,
  },
  {
    id: '44yuFal6SJQQW1zi38eXDn',
    uri: 'spotify:track:44yuFal6SJQQW1zi38eXDn',
    name: 'Not Without a Purpose',
    album: {
      images: [
        {
          height: 640,
          width: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273d550b2d362b54d59e2560504',
        },
        {
          height: 300,
          width: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02d550b2d362b54d59e2560504',
        },
        {
          height: 64,
          width: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851d550b2d362b54d59e2560504',
        },
      ],
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/0spqoVkfVzRyAPmA6ZY5F9',
        },
        href: 'https://api.spotify.com/v1/artists/0spqoVkfVzRyAPmA6ZY5F9',
        id: '0spqoVkfVzRyAPmA6ZY5F9',
        name: 'Street Dogs',
        type: 'artist',
        uri: 'spotify:artist:0spqoVkfVzRyAPmA6ZY5F9',
      },
    ],
    duration_ms: 195240,
  },
];
