import dotenv from 'dotenv';
dotenv.config();

// server
export const nodeEnv = process.env.NODE_ENV;
export const serverPort = process.env.SERVER_PORT;

// mongo
export const mongoUrl = process.env.MONGO_URL;

// web token
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

// spotify
export const spotifyRedirectUri = process.env.SPOTIFY_REDIRECT_URI;
export const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
export const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
