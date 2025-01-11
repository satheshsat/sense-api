const express = require('express');
const router = express.Router();
const userModel = require('../schemas/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail = require('../mail/sendmail');

router.post('/login', async (req, res) => {
  const loginDetail = req.body;
  if(!loginDetail.email){
    res.status(400).json({'message': 'Email is required'});
    return;
  }
  if(!loginDetail.password){
    res.status(400).json({'message': 'Password is required'});
    return;
  }

  var user = await userModel.findOne({email: loginDetail.email});
  if(!user){
    res.status(403).json({'message': 'Invalid email'});
    return;
  }

  if(await bcrypt.compare(loginDetail.password, user.password)){
      //creating a access token
      const accessToken = jwt.sign({
          name: user.name,
          email: user.email,
          role: user.role
      }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '10m'
      });
      // Creating refresh token not that expiry of refresh 
      //token is greater than the access token

      const refreshToken = jwt.sign({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
      }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      // Assigning refresh token in http-only cookie 
      res.cookie('jwt', refreshToken, {
          httpOnly: true,
          sameSite: 'None', secure: true,
          maxAge: 24 * 60 * 60 * 1000
      });
      return res.json({message: 'success', data: user, accessToken, refreshToken });
  }else{
    res.status(403).json({'message': 'Invalid password'});
  }
})

router.post('/refresh', async (req, res) => {
  if (!req.cookies?.jwt && !req.body.refreshToken) {
    return res.status(403).json({ error: "token_expired", message: 'Unauthorized' });
  }

  let refreshToken = req.cookies.jwt;
  if(!refreshToken){
    refreshToken = req.body.refreshToken;
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
        if (err) {

            // Wrong Refesh Token
            return res.status(403).json({ message: 'Unauthorized' });
        }
        else {
            // Correct token we send a new access token
            const accessToken = jwt.sign({
                name: decoded.name,
                email: decoded.email,
                role: decoded.role
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '10m'
            });
            return res.json({ accessToken });
        }
  })

})

// router.post('/register', async (req, res) => {
//     try{
//       const userData = req.body;
//       if(!userData.name){
//         res.status(400).json({'message': 'User name is required'});
//         return;
//       }
//       if(!userData.email){
//         res.status(400).json({'message': 'Email is required'});
//         return;
//       }
//       if(!userData.password){
//         res.status(400).json({'message': 'Password is required'});
//         return;
//       }
//       var exists = await userModel.findOne({email: userData.email});
//       if(exists){
//         res.status(400).json({'message': 'User email already exists'});
//         return;
//       }
//       var result = await userModel.create({
//         name: userData.name,
//         email: userData.email,
//         role: 'user',
//         password: await bcrypt.hash(userData.password, 10),
//         createdby: 'sys',
//         modifiedby: 'sys',
//         modifiedat: Date.now(),
//       });
//       res.json({message: 'success', data: result})
//     }catch(e){
//       console.log(e);
//       res.json({'message': 'Something went wrong'});
//     }
// })

router.post('/logout', async (req, res) => {
  res.clearCookie('jwt');
  res.json({'message': 'Logged out'});
})

router.post('/resetpass', async (req, res) => {

  const body = req.body;
  if(!body.email){
    return res.status(400).json({'message': 'Email is required'});
  }

  var user = await userModel.findOne({email: body.email});
  if(!user){
    res.status(403).json({'message': 'Invalid email'});
    return;
  }
  var password = makeid(8);
  await userModel.findByIdAndUpdate({_id: user._id}, {password: await bcrypt.hash(password, 10)})
  await mail.sendMail({
    from: '"Express js" <satheshs.sat@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Password Reset", // Subject line
    text: "Your New Password is "+password, // plain text body
  })
  res.json({'message': 'Mail send'});
})

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

module.exports = router;