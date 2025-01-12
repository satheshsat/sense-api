const express = require('express')
const router = express.Router()
const serviceEntryModel = require('../schemas/serviceEntry');

router.get('/list', async (req, res) => {
    var list = await serviceEntryModel.find({});
    if (!list || !list.length) {
        res.status(403).json({ 'message': 'No data found' });
        return;
    } else {
        res.json({ list: list, message: 'Success' });
        return;
    }
})

router.post('/create', async (req, res) => {
    try {
        const data = req.body;
        var exists = await userModel.findOne({ email: data.email });
        if (exists) {
            res.status(400).json({ 'message': 'User email already exists' });
            return;
        }
        var result = await userModel.create({
            ...data,
            createdby: req.decoded._id,
            modifiedby: 'sys',
            modifiedat: Date.now(),
        });
        res.json({ message: 'success', data: result })
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'Something went wrong' });
    }
})

router.post('/update/:_id', (req, res) => {
    res.send('Express on Vercel')
})

router.delete('/delete/:_id', async (req, res) => {
    if(!req.params._id){
        res.status(400).json({ 'message': 'Select user to delete' });
        return;
    }
    try{
    var exists = await userModel.findOne({ _id: req.params._id });
    if(!exists){
        res.status(404).json({ 'message': 'User not found' });
        return;
    }

    let doc = await userModel.findOneAndDelete({ _id: req.params._id});
    res.json({ message: 'success', data: doc })
    } catch (err) {
        console.log(e);
        res.json({ 'message': 'Something went wrong' });
    }
})

module.exports = router;