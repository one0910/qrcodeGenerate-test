const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Member = require("./models/member");
dotenv.config({path:"./config.env"})

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB,{
    serverSelectionTimeoutMS: 1000
}).then(()=>{
    console.log('連線成功',)
}).catch((error)=>{
    console.log('error.message',error.message)
    console.log('error.reason',error.reason)
})



app.use(cors());
app.use(express.json());

app.get('/member', async(request,response)=>{
     try {
        const member =  await Member.find();
        console.log('member',member)
        response.json({
            "status":"scuccss",
            "result":member
        })
     } catch (error) {
        console.error(error.toString());
        response.status(500).json({ "error": error.toString() });
     }
})

app.patch("/member/:userid/",async(request,response)=>{
    console.log('request.body.memberImgurl.',request.body.memberImgurl)
    // console.log('request.params',request.params)
    try {
        const newId = new mongoose.Types.ObjectId().toString();
        const id = request.params.userid
        const memberImgurl = request.body.memberImgurl
        console.log("newId",newId);
        Member.findByIdAndUpdate(id,{
            "name": "Bill",
            "qrcodeurl": `https://coolmovie/member/${newId}`,
            "memberimgurl":memberImgurl
        }).then(async()=>{
            const newMember = await Member.find()
            response.json({
                "status":"scuccss",
                "result":newMember
            })
        })
    } catch (error) {
        console.log('error',error.toString())
        response.json({
            "status":"fail",
            "message":error.toString()
        })
    }
    

})


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});