let express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../templates/base.html'));
});

router.get('/games/barbu', (req, res) => {
    res.sendFile(path.join(__dirname, '../../templates/games/barbu.html'));
});

module.exports = router;