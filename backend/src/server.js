import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { dbConnect } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { functions, inngest } from "../src/lib/inngest.js";
import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from "./middleware/protectRoute.js";
import {chatRoutes} from "./routes/chatRoutes.js";

const app = express();

app.use(express.json());

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions}));
 
app.use('/api/chat',protectRoute,chatRoutes)

const __dirname = path.resolve();

app.get("/hello",protectRoute,(req, res) => { 
  res.status(200).json({ message: "Success, you have successfully logged in" });
});

if (ENV.NODE_ENV === "Production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(ENV.PORT, () => console.log("server is runnig"));
  } catch (e) {
    console.error(e);
  }
};
startServer();
