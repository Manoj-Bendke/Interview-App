import { Inngest } from "inngest";
import { dbConnect } from "./db.js";
import { User } from "../models/Users.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "interview-App", isDev: false });

const syncUser = inngest.createFunction(
  { id: "syncUser" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await dbConnect();
    const { id, email_addresses, last_name, first_name, image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url.toString(),
    };
    await User.create(newUser);
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);
const deleteUser = inngest.createFunction(
  { id: "deleteUser" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await dbConnect();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, deleteUser];
