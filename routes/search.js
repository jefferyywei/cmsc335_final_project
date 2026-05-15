const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /search?q=term — search iTunes, return JSON
router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ results: [] });

  try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: { term: q, media: 'music', entity: 'song', limit: 10 },
      timeout: 8000
    });

    const results = (response.data.results || []).map(t => ({
      title:      t.trackName,
      artist:     t.artistName,
      albumCover: (t.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
      previewUrl: t.previewUrl || ''
    }));

    res.json({ results });
  } catch (err) {
    console.error('iTunes API error:', err.message);
    res.json({ results: [], error: 'Could not reach iTunes API' });
  }
});

module.exports = router;
