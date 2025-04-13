import { Permission } from "node-appwrite";
import {db, voteCollection} from "../name"
import { databases } from "./config";

export default async function createVoteCollection () {
    await databases.createCollection(db, voteCollection, voteCollection, [
        Permission.create("users"),
        Permission.read("users"),
        Permission.read("any"),
        Permission.update("users"),
        Permission.delete("users")
    ]);
    console.log("Vote collection created");

    await Promise.all([
        databases.createEnumAttribute(db, voteCollection, "type",
            ["answer", "question"],
            true
        ),
        databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
        databases.createEnumAttribute(db, voteCollection, "voteStatus", ["upvoted", "downVoted"], true),
        databases.createStringAttribute(db, voteCollection, "votedById", 50, true)
    ]);
    console.log("Collection created for Votes");
}