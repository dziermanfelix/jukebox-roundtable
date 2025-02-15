export const jukeboxExistsError = (jukeboxName) => {
  return { msg: `jukebox ${jukeboxName} is being used` };
};

export const jukeboxDoesNotExistError = (jukeboxName) => {
  return { msg: `jukebox ${jukeboxName} does not exist` };
};

export const jukeboxBadCredentialsError = (jukeboxName) => {
  return { msg: `wrong code for jukebox ${jukeboxName}` };
};

export const jukeboxSuccessfulLogout = (jukeboxName, sessionId) => {
  return { msg: `user logged out of jukebox ${jukeboxName} with session id ${sessionId}` };
};

export const noSessionWithWebTokenError = (webToken) => {
  return { msg: `no session with webToken ${webToken}` };
};

export const noToken = () => {
  return { msg: `no token` };
};

export const notAuthorizedToJoinJukebox = (jukeboxName) => {
  return { msg: `not authorized to join jukebox ${jukeboxName}` };
};

export const placeHolder = (jukeboxName) => {
  return { msg: `place holder ${jukeboxName}` };
};

export const deleteJukeboxSuccess = (jukeboxName) => {
  return { msg: `jukebox ${jukeboxName} deleted` };
};

export const sessionExistsError = (webToken) => {
  return { msg: `session exists with web token ${webToken}` };
};
