export const basePath = '/';

// frontend
export const startPath = `${basePath}start/`;
export const startAuthenticatedPath = `${basePath}start/authenticated/`;
export const joinPath = `${basePath}join/`;
export const jukeboxPath = `${basePath}jukebox/`;

// backend
export const jukeboxAuthPath = `${basePath}auth/`;
export const jukeboxCreatePath = `${jukeboxAuthPath}create/`;
export const jukeboxLoginPath = `${jukeboxAuthPath}login/`;
export const jukeboxLogoutPath = `${jukeboxAuthPath}logout/`;
export const startJukeboxPath = `${jukeboxPath}start/`;
export const queuePath = `${basePath}queue/`;
export const getQueuePath = `${queuePath}get-queue/`;
export const setQueuePath = `${queuePath}set-queue/`;
export const nextTrackPath = `${queuePath}get-next-track/`;
export const accessTokenPath = `${basePath}access-token/`;

// spotify
export const spotifyPath = `${basePath}spotify/`;
export const spotifyLoginUrlPath = `${spotifyPath}login-url/`;
export const searchPath = `${spotifyPath}search/`;
export const albumPath = `${spotifyPath}album/`;
export const artistPath = `${spotifyPath}artist/`;
