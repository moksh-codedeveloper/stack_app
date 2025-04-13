import { IndexType, Permission } from "node-appwrite";
import { answerCollection, db } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  await databases.createCollection(db, answerCollection, answerCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  await Promise.all([
    databases.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      255,
      true
    ),
    databases.createStringAttribute(
      db,
      answerCollection,
      "authorId",
      255,
      true
    ),
    databases.createStringAttribute(db, answerCollection, "content", 255, true),
  ]);
  console.log(`Collection ${answerCollection} created successfully`);
}
