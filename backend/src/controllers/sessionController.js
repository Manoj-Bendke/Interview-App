import Session from "../models/Session.js";
import { streamClient, chatClient } from "../lib/stream.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ error: "Problem and difficulty is required" });
    }
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });
    const channle = chatClient.channel("messaging", callId, {
      name: `${problem}Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });
    await channle.create();
    res.status(201).json({ session });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
}
export async function getActiveSession(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
}
export async function getMyTRecentSession(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
}
export async function getSessionByID(req, res) {
  try {
    const { id } = req.params;
    const sessions = await Session.findById(id)
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId");
  } catch (error) {
    res.status(500).json({ error: "Internal error" });
  }
}
export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;
    const session = await Session.findById(id);

    if (!session) {
      return res.status(401).json({ error: "Session not found" });
    }

    if (session.participant) {
      return res.status(404).json({ message: "The room is full" });
    }

    session.participant = userId;
    session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ error: "Internal error" });
  }
}
export async function endSession(req,res) {
  try {
     const { id } = req.params;
    const userId = req.user._id;
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if(session.host.toString() === userId.toString()){
      return res.status(403).json({ error: "only the host can end a session" });
    }
    if(session.status === "completed"){
      return res.status(400).json({ error: "Session is already completed" });
    }
    session.status= "completed";
    await session.save();

    const channel = chatClient.channel("messaging",session.callId);
    await  channel.delete({hard:true})

    res.status(200).json({message:"Session has been ended"})
  } catch (error) {
    
  }
}
