const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Express on Vercel')
})

router.post('/', (req, res) => {
    // res.send('Express on Vercel')
    res.json({user: req.decoded});
})

module.exports = router;