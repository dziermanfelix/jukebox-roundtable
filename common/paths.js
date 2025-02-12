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
export const getNextTrackPath = `${jukeboxPath}get-next-track/`;
export const playedTracksPath = `${jukeboxPath}played-tracks/`;
export const jukeboxExistsPath = `${jukeboxPath}jukebox-exists/`;
export const jukeboxCreatePath = `${jukeboxPath}create/`;
export const initAccessTokenPath = `${jukeboxPath}init-access-token/`;
export const accessTokenPath = `${jukeboxPath}access-token/`;
export const getOrderPath = `${jukeboxPath}get-queue-order/`;
export const setOrderPath = `${jukeboxPath}set-queue-order/`;

// auth
export const authPath = `${basePath}auth/`;
export const loginPath = `${authPath}login/`;
export const logoutPath = `${authPath}logout/`;

// session
export const sessionPath = `${basePath}session/`;
export const starterSessionPath = `${sessionPath}starter/`;
export const joinerSessionPath = `${sessionPath}joiner/`;
export const getQueuePath = `${sessionPath}get-queue/`;
export const setQueuePath = `${sessionPath}set-queue/`;

// spotify
export const spotifyPath = `${basePath}spotify/`;
export const spotifyLoginUrlPath = `${spotifyPath}login-url/`;
export const searchPath = `${spotifyPath}search/`;
export const albumPath = `${spotifyPath}album/`;
export const artistPath = `${spotifyPath}artist/`;
