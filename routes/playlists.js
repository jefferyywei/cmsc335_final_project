const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// GET /playlists — list all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.render('playlists', { playlists, error: null });
  } catch (err) {
    res.render('playlists', { playlists: [], error: 'Could not load playlists.' });
  }
});

// GET /playlists/new — show create form
router.get('/new', (req, res) => {
  res.render('new-playlist', { error: null });
});

// POST /playlists — save new playlist
router.post('/', async (req, res) => {
  const { name, mood, numSongs, songs } = req.body;
  const allowedMoods = ['happy', 'sad', 'energetic', 'chill', 'romantic', 'angry', 'focused'];
  const songCount = Number.parseInt(numSongs, 10);

  // songs comes in as array of objects from the form
  let songsArr = [];
  if (songs && Array.isArray(songs)) {
    songsArr = songs.filter(s => s.title && s.artist).map(s => ({
      title: s.title.trim(),
      artist: s.artist.trim(),
      albumCover: s.albumCover || '',
      previewUrl: s.previewUrl || ''
    }));
  } else if (songs && songs.title && songs.artist) {
    // single song submitted
    songsArr = [{
      title: songs.title.trim(),
      artist: songs.artist.trim(),
      albumCover: songs.albumCover || '',
      previewUrl: songs.previewUrl || ''
    }];
  }

  if (!name || !mood || !Number.isInteger(songCount)) {
    return res.render('new-playlist', { error: 'Please fill in all required fields.' });
  }

  if (!allowedMoods.includes(mood) || songCount < 1 || songCount > 20) {
    return res.render('new-playlist', { error: 'Please choose a valid mood and number of songs.' });
  }

  try {
    const playlist = new Playlist({ name: name.trim(), mood, numSongs: songCount, songs: songsArr });
    await playlist.save();
    res.redirect('/playlists');
  } catch (err) {
    console.error(err);
    res.render('new-playlist', { error: 'Could not save playlist. Please try again.' });
  }
});

// GET /playlists/:id — view one playlist
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.redirect('/playlists');
    res.render('playlist-detail', { playlist });
  } catch (err) {
    res.redirect('/playlists');
  }
});

// POST /playlists/:id/delete — delete playlist
router.post('/:id/delete', async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.redirect('/playlists');
  } catch (err) {
    res.redirect('/playlists');
  }
});

module.exports = router;
