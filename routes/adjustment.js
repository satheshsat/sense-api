const express = require('express')
const router = express.Router()
const adjustmentModel = require('../schemas/adjustment')

router.get('/entryno', async (req, res) => {
    var lastData = await adjustmentModel.findOne().sort({createdat: 'desc'})
    if(lastData && lastData.entryno){
        res.json({entryno: lastData.entryno+1});
        return;
    }else{
        res.json({entryno: 1});
        return;
    }
})

router.get('/list', async (req, res) => {
    if(req.query.entryno){
            var list = await adjustmentModel.findOne({ entryno: req.query.entryno })
            if (!list) {
                res.status(403).json({ 'message': 'No data found' });
                return;
            } else {
                res.json(list);
                return;
            }
        }
        var list = await adjustmentModel.find({});
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
        var exists = await adjustmentModel.findOne({ entryno: data.entryno });
        if (exists) {
            res.status(400).json({ 'message': 'entryno already exists' });
            return;
        }
        var result = await adjustmentModel.create({
            ...data,
            createdby: req.decoded._id,
            modifiedby: 'sys',
            modifiedat: Date.now(),
        });
        res.json({ message: 'success', data: result })
    } catch (e) {
        console.log(e);
        res.status(400).json({ 'message': 'Something went wrong' });
    }
})

router.post('/update/:_id', async (req, res) => {
    if(!req.params._id){
        res.status(400).json({ 'message': 'Select data to delete' });
        return;
    }
    var data = req.body;
    try{
        var exists = await adjustmentModel.findOne({ _id: req.params._id });
        if(!exists){
            res.status(404).json({ 'message': 'Data not found' });
            return;
        }
        var entryExists = await adjustmentModel.findOne({ entryno: data.entryno });
        if(entryExists.entryno == exists.entryno){
            delete data.entryno;
        }else{
            res.status(400).json({ 'message': 'User Entry already exists' });
            return;
        }

        if(!data){
            res.status(400).json({ 'message': 'No data to update' });
            return;
        }

        data.modifiedat = Date.now();
        data.modifiedby = req.decoded._id;

        const filter = { _id: req.params._id };

        // `doc` is the document _after_ `update` was applied because of
        // `new: true`
        const doc = await adjustmentModel.findOneAndUpdate(filter, data, {
            new: true
        });
        res.json({ message: 'success', data: doc })
    } catch (e) {
        console.log(e);
        res.status(400).json({ 'message': 'Something went wrong' });
    }
})

router.delete('/delete/:_id', async (req, res) => {
    if(!req.params._id){
        res.status(400).json({ 'message': 'Select data to delete' });
        return;
    }
    try{
    var exists = await adjustmentModel.findOne({ _id: req.params._id });
    if(!exists){
        res.status(404).json({ 'message': 'Data not found' });
        return;
    }

    let doc = await adjustmentModel.findOneAndDelete({ _id: req.params._id});
    res.json({ message: 'success', data: doc })
    } catch (err) {
        console.log(e);
        res.status(400).json({ 'message': 'Something went wrong' });
    }
})

module.exports = router;