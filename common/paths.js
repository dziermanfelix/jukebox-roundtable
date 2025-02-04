// base
export const basePath = '/';

// frontend
export const spotifyLoginPath = `${basePath}spotifylogin/`;
export const startPath = `${basePath}start/`;
export const joinPath = `${basePath}join/`;
export const jukeboxPath = `${basePath}jukebox/`;

// jukebox
export const jukeboxPrivatePath = `${basePath}jukebox-priv/`;
export const startJukeboxPath = `${jukeboxPath}start/`;
export const playedTracksPath = `${jukeboxPath}played-tracks/`;
export const jukeboxExistsPath = `${jukeboxPath}jukebox-exists/`;
export const jukeboxCreatePath = `${jukeboxPath}create/`;

// auth
export const authPath = `${basePath}auth/`;
export const loginPath = `${authPath}login/`;
export const logoutPath = `${authPath}logout/`;
export const initAccessTokenPath = `${authPath}init-access-token/`;

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
