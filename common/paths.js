// base
export const basePath = '/';

// frontend
export const prestartPath = `${basePath}prestart/`;
export const startPath = `${basePath}start/`;
export const joinPath = `${basePath}join/`;
export const jukeboxPath = `${basePath}jukebox/`;

// backend
// jukebox
export const jukeboxAuthPath = `${basePath}auth/`;
export const jukeboxCreatePath = `${jukeboxAuthPath}create/`;
export const initAccessTokenPath = `${jukeboxAuthPath}init-access-token/`;
export const jukeboxLoginPath = `${jukeboxAuthPath}login/`;
export const jukeboxLogoutPath = `${jukeboxAuthPath}logout/`;
export const startJukeboxPath = `${jukeboxPath}start/`;
// queue
export const queuePath = `${basePath}queue/`;
export const getQueuePath = `${queuePath}get-queue/`;
export const setQueuePath = `${queuePath}set-queue/`;
// access token
export const accessTokenPath = `${basePath}access-token/`;
// session
export const sessionPath = `${basePath}session/`;
export const starterSessionPath = `${basePath}session/starter`;
export const joinerSessionPath = `${basePath}session/joiner`;

// spotify
export const spotifyPath = `${basePath}spotify/`;
export const spotifyLoginUrlPath = `${spotifyPath}login-url/`;
export const searchPath = `${spotifyPath}search/`;
export const albumPath = `${spotifyPath}album/`;
export const artistPath = `${spotifyPath}artist/`;
