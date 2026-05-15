const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  artist: { type: String, required: true },
  albumCover: { type: String, default: '' },
  previewUrl: { type: String, default: '' }
});

const playlistSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  mood:      { type: String, required: true, enum: ['happy','sad','energetic','chill','romantic','angry','focused'] },
  numSongs:  { type: Number, required: true, min: 1, max: 20 },
  songs:     [songSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
