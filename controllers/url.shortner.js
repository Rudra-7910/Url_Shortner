import { Url } from "../models/url.model.js";
import { nanoid } from "nanoid";
export const createUrl=async(req,res)=>{
    try {
        const {redirectUrl}=req.body
        if(!redirectUrl)
        {
            throw new Error("URL is required");
        }
        let shortId= nanoid(5)
        const obj= new Url ({
            shortId:shortId,
            redirectUrl:redirectUrl,
        })
        obj.save();
        return res.status(201).json({
            success:true , 
            message:"short Url is ready ",
            data:obj,
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
        })
    }
}
export const getAllUrl=async(req,res)=>{
    try {
        const urls= await Url.find()
        return res.status(200).json({
            success:true , 
            message:"All shorted URLs  ",
            data:urls,
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
        })
    }
}
const redirecttoUrl=async(req,res)=>{
    try {
        const {shortId}=req.params
        const url= await Url.findOne({shortId:shortId})
        if(!url)
        {
            throw new Error ("something went wrong");
        }
        url.visited+=1
        await url.save()
        return res.redirect(url.redirectUrl)
    } catch (error) {
        throw new Error ("sometihng went wrong");
    }
}
export {redirecttoUrl}