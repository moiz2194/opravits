const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');
// const accountSid = "ACa62ce3266700d7f89a4f2b43fc59a05c";
// const authToken = "7aaf8d93004918de10a765018ab0678a";
// const client = require('twilio')(accountSid, authToken);
// const sendmsg=(phone,otp)=>{
//     client.messages
//   .create({
//      body: `Your Otp For Pride App is : ${otp}`,
//      from: '+919945735175',
//      to: `+919591372924`
//    })
//   .then(message => console.log(message.sid)).catch((err)=>{
// console.log(err)
//   });

// }

const client =new Client({
    puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
        
    },
    authStrategy: new LocalAuth()
})
client.on('authenticated', (session) => {

});
 
 

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})
client.on("ready",()=>{
   console.log('ready')
})
const sendmsg=(phone,otp)=>{
    const chatid=phone+"@c.us";
    const message=`Your Otp for pride App is : ${otp}`;
    console.log(chatid,message)
    client.sendMessage(chatid,message)
}

module.exports=sendmsg