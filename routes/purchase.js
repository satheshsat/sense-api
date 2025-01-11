const express = require('express')
const router = express.Router()

router.get('/list', async (req, res) => {
    res.send('Express on Vercel')
})

router.post('/create', (req, res) => {
    res.send('Express on Vercel')
})

router.post('/update', (req, res) => {
    res.send('Express on Vercel')
})

router.post('/delete', (req, res) => {
    res.send('Express on Vercel')
})

module.exports = router;