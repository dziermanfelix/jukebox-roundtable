import { Router } from 'express';
import { searchSpotify, getAlbum, getArtist, getSpotifyLoginUrl } from './spotifyController.js';

const router = Router();
router.route('/login-url').get(getSpotifyLoginUrl);
router.route('/search').post(searchSpotify);
router.route('/album').post(getAlbum);
router.route('/artist').post(getArtist);
export default router;
