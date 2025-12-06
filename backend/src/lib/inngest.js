import inngest from "inngest";
import { dbConnect } from "./db.js";
import { User } from "../models/Users.js";

export const inngest = new inngest({ id: "interview-App" });

export const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await dbConnect();
    const { id, email_addresses, last_name, first_name, imgae_url } =
      event.data;
    const newUser = {
      id: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: imgae_url,
    };
    await User.create(newUser);
  }
);
export const deleteUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await dbConnect();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);
