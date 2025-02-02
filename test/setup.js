import mongoose from 'mongoose';
import { mongoUrl } from '../utils/environmentVariables';
import { apiVersionBaseUrl } from '../common/api';

async function truncateDb() {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}

beforeAll(async () => {
  await mongoose.connect(mongoUrl);
});

beforeEach(async () => {
  await truncateDb();
});

afterAll(async () => {
  await truncateDb();
  await mongoose.connection.close();
});

export function makeMockJukebox() {
  const name = 'dust';
  const code = 'dust';
  const spotifyCode = '';
  const role = 'starter';
  return { name: name, code: code, spotifyCode: spotifyCode, role: role };
}

export function makeUrl(url) {
  return `${apiVersionBaseUrl}${url}`;
}
