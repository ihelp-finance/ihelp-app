const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json([{
    version: 1,
    path: '/api/v1',
  }]);
});
router.get('/v1', (req, res) => {
  res.json([{
    data: '/api/v1/data',
  }]);
});

module.exports = router;
