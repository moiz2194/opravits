const express = require('express');
const app = express();
const connecttomongo = require('./db');
const cors = require('cors')
const cron = require('node-cron')
const User = require('./model/user.js')
const Member = require('./model/members')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
const errorMiddleware = require('./middlewares/error.js')
app.use(cors())
connecttomongo();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
cloudinary.config({
  cloud_name: "dfxlbsgzh",
  api_key: "137567235279886",
  api_secret: "UWzrLp3_nMb29HMPWf3s0zkV3V0"
});
app.use('/api/user', require('./routes/user.js'))
app.use('/api/admin', require('./routes/admin.js'))
app.use('/api/business', require('./routes/business.js'))
app.use('/api/chat', require('./routes/chat.js'))
app.use('/api/message', require('./routes/messages.js'))
cron.schedule('0 0 * * *', async () => {
  console.log('cron running')
  const today = new Date();
  const day = today.getDate()
  const user = await User.find().populate('membership_id')
  for (const elem of user) {
      var date = new Date(elem.membership_id.end)
      if (date === day) {
        await User.findByIdAndUpdate(elem._id, {
          membership_id: "none"
        })
         await Member.findByIdAndDelete(elem.membership_id._id)
    }
  }})

  app.use(errorMiddleware);
  module.exports = app;