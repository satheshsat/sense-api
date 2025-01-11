const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendMail(options){
    return await transporter.sendMail(options);
}

module.exports = {
    sendMail,
};