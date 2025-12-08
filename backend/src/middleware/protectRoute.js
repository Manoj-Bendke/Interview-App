import { requireAuth } from "@clerk/express";
import  {User}  from "../models/Users.js";
export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) {
        return res.status(401).json({ error: "user not authorized" });
      }
      const user = await User.findOne({clerkId});
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(400).json({error:"something went wrong with the authorization"})
    }
  },
];
