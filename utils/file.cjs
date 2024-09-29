const fs = require('fs');

const f = './utils/access_token';

const writeAccessToken = async (token) => {
  fs.writeFile(f, token, { flag: 'w' }, function (err) {
    if (err) throw err;
  });
};

const readAccessToken = async () => {
  let accessToken = '';
  if (fs.existsSync(f)) {
    accessToken = fs.readFileSync(f);
  }
  return accessToken;
};

exports.writeAccessToken = writeAccessToken;
exports.readAccessToken = readAccessToken;
