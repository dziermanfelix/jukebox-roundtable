import Config from '../models/ConfigModel.js';

export const setAccessToken = async (token) => {
  await Config.replaceOne(
    { key: 'accessToken' },
    { key: 'accessToken', value: token },
    {
      upsert: true,
    }
  );
};

export const getAccessToken = async () => {
  let token = await Config.findOne({ key: 'accessToken' });
  if (token) {
    token = token['value'];
  } else {
    token = '';
  }
  return token;
};
