export const jukeboxExistsError = (jukebox) => {
  return { msg: `jukebox ${jukebox} is being used` };
};

export const jukeboxDoesNotExistError = (jukebox) => {
  return { msg: `jukebox ${jukebox} does not exist` };
};
