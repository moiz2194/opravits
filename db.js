const mongoose=require('mongoose');
const uri='secret';
const connecttomongo=()=>
{
    mongoose.connect(uri).then((data)=>{
        console.log('Connected to databse successfully '+ data.Connection.name)
    }).catch((err)=>{
        console.log(err);
    })
};
module.exports=connecttomongo;
