import {IndexType, Permission} from "node-appwrite";
import {db, questionCollection} from "../name"
import {databases} from "./config";

export default async function createQuestionCollection () {
    await databases.createCollection(
        db, questionCollection, questionCollection, [
            Permission.read("any"), // only users can read question but 
            Permission.read("users"), // users who are logged in can perform crud operations 
            Permission.write("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]
    )
    console.log("Questions collections created");
    await Promise.all([
        databases.createStringAttribute(db, questionCollection, "title", 100, true),
        databases.createStringAttribute(db, questionCollection, "content", 1000, true),
        databases.createStringAttribute(db, questionCollection, "authorID", 50, true),
        databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true),
        databases.createStringAttribute(db, questionCollection, "attachmentID", 50,false),
    ])
    console.log("Questions collections attributes created");

    await Promise.all([
        databases.createIndex(db, questionCollection, "title", IndexType.Fulltext, ["title"], ['asc']),
        databases.createIndex(db, questionCollection, "content", IndexType.Fulltext, ["content"], ['asc']),
    ])
}