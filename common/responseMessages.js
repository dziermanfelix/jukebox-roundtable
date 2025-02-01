export const jukeboxExistsError = (jukebox) => {
  return { msg: `jukebox ${jukebox} is being used` };
};

export const jukeboxDoesNotExistError = (jukebox) => {
  return { msg: `jukebox ${jukebox} does not exist` };
};

export const jukeboxBadCredentialsError = (jukebox) => {
  return { msg: `wrong code for jukebox ${jukebox}` };
};

export const jukeboxSuccessfulLogin = (jukebox) => {
  return { msg: `user logged into jukebox ${jukebox}` };
};

export const jukeboxSuccessfulLogout = (jukebox, sessionId) => {
  return { msg: `user logged out of jukebox ${jukebox} with session id ${sessionId}` };
};

export const noToken = (jukbox) => {
  return { msg: `no token` };
};

export const notAuthorizedToJoinJukebox = (jukebox) => {
  return { msg: `not authorized to join jukebox ${jukebox}` };
};

export const placeHolder = (jukebox) => {
  return { msg: `place holder ${jukebox}` };
};