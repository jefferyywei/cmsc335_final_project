const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 }).limit(5);
    res.render('index', { playlists });
  } catch (err) {
    res.render('index', { playlists: [] });
  }
});

module.exports = router;
