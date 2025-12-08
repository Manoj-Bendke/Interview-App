import { chatClient } from "../lib/stream.js";
export async function getStreamToken(req,res) {
  try {
    const token = chatClient.createToken(req.user.clerkId)
    res.staus(200).json({
      token,
      userId : req.user.clerkId,
      userName : req.user.name,
      userImage : req.user.image,
    })
  } catch (error) {
     res.status(500).json({error:"internal error"})  
  }
}