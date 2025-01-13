const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  if(req.decoded._id){
        var userList = await userModel.findOne({ _id: req.decoded._id })
        if (!userList) {
            res.status(403).json({ 'message': 'No data found' });
            return;
        } else {
            res.json(userList);
            return;
        }
    }else{
      res.status(403).json({ 'message': 'Unauthorised' });
    }
})

router.post('/', (req, res) => {
    // res.send('Express on Vercel')
    res.json({user: req.decoded});
})

module.exports = router;