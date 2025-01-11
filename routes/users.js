const express = require('express')
const router = express.Router()
const userModel = require('../schemas/users');
const bcrypt = require('bcrypt');

router.get('/list', async (req, res) => {
    var userList = await userModel.find({});
    if (!userList || !userList.length) {
        res.status(403).json({ 'message': 'Invalid email' });
        return;
    } else {
        res.json({ userList: userList, message: 'Success' });
        return;
    }
})

router.post('/create', async (req, res) => {
    try {
        const userData = req.body;
        if (!userData.name) {
            res.status(400).json({ 'message': 'User name is required' });
            return;
        }
        if (!userData.email) {
            res.status(400).json({ 'message': 'Email is required' });
            return;
        }
        if (!userData.role) {
            res.status(400).json({ 'message': 'Role is required' });
            return;
        }
        if (!userData.password) {
            res.status(400).json({ 'message': 'Password is required' });
            return;
        }
        var exists = await userModel.findOne({ email: userData.email });
        if (exists) {
            res.status(400).json({ 'message': 'User email already exists' });
            return;
        }
        var result = await userModel.create({
            name: userData.name,
            email: userData.email,
            role: 'user',
            password: await bcrypt.hash(userData.password, 10),
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

router.post('/update/:_id', async (req, res) => {
    if(!req.params._id){
        res.status(400).json({ 'message': 'Select user to delete' });
        return;
    }
    var exists = await userModel.findOne({ _id: req.params._id });
    if(!exists){
        res.status(404).json({ 'message': 'User not found' });
        return;
    }
    try {
        const userData = req.body;
        let updateData = {};
        if (userData.name) {
            updateData.name = userData.name;
        }
        if (userData.email) {
            updateData.email = userData.email;
        }
        if (userData.role) {
            updateData.role = userData.role;
        }
        if (!userData.password) {
            updateData.password = userData.password;
        }
        var emailExists = await userModel.findOne({ email: userData.email });
        if(emailExists.email == exists.email){
            delete updateData.email;
        }else{
            res.status(400).json({ 'message': 'User email already exists' });
            return;
        }

        if(!updateData){
            res.status(400).json({ 'message': 'No data to update' });
            return;
        }

        updateData.modifiedat = Date.now();
        updateData.modifiedby = req.decoded._id;

        const filter = { _id: req.params._id };

        // `doc` is the document _after_ `update` was applied because of
        // `new: true`
        const doc = await userModel.findOneAndUpdate(filter, updateData, {
            new: true
        });
        res.json({ message: 'success', data: doc })
    } catch (e) {
        console.log(e);
        res.json({ 'message': 'Something went wrong' });
    }
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