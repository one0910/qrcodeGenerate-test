const mongoose = require('mongoose')
const memberSchema = new mongoose.Schema(
    {
        name:String,
        qrcodeurl:String,
        memberimgurl:String,
        createdAt:{
            type:Date,
            default:Date.now,
            select:false
        }
    },
    {
        versionKey:false,
        // timestamps:true,
        // collection:"開放間"
    },
)


const Member = mongoose.model('Member',memberSchema)
module.exports = Member