import mongoose, { Schema } from "mongoose";
const UrlSchema= new Schema({
    redirectUrl:{
        type:String,
        required:true,
    },
    shortId:{
        type:String,
        required:true,
        unique:true ,
    },
    visited:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
},
)
export const Url=mongoose.model("Url",UrlSchema);