const app = require('./app.js');
const port = process.env.PORT || 5001;
const http = require('http').Server(app);
const jwt=require('jsonwebtoken');
const { get } = require('http');
const io = require('socket.io')(http,{
  pingTimeout:60000,
  cors: {
    origin:[ "http://localhost:3000", "http://localhost:3001"],
    credentials: true
  }
});

io.on('connection',(socket)=>{
  console.log('someone connected')
  socket.on('setup',(userData)=>{
    socket.join(userData?._id)
    // console.log(userData)
    socket.emit('connected')
  })
  socket.on('join chat',(room)=>{
    socket.join(room)
    // console.log('User joined room',room)
  })
  socket.on('new message',(messagerecieved)=>{
    var chat=messagerecieved.chat;
   if(!chat.users) return console.log('chat.users in undefined')
   chat.users.forEach(user => {
    if(user._id===messagerecieved.sender._id) return;
    socket.in(user._id).emit("message received",messagerecieved)
   });
  })
})
app.get('/', (req, res) => {
    res.send('app is working');
});

http.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});

// io.on('connection', (socket) => {
//     console.log('A user connected');
//     const token = socket.handshake.query.token;
//    let userId= gettoken(token)
//    socket.userId=userId
// });

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    http.close(() => {
      process.exit(1);
    });
});
const getIO=()=>{
  return io
}
exports.Scan=getIO