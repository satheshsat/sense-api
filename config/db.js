const mongoose = require('mongoose');
const uri = process.env.ATLAS_URI;

function connect(){
  mongoose
      .connect(uri)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error');
      });
}

module.exports = connect;
// run().catch(console.dir);