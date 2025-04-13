import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import {storage} from "./config"

export default async function getOrCreateStorage(){
    try {
        await storage.getBucket(questionAttachmentBucket);
        console.log("Storage Connected");
    } catch (error) {
        try {
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.read("users"),
                    Permission.read("any"),
                    Permission.create("users"),
                    Permission.update("users"),
                    Permission.delete("users")
                ],
                false,
                undefined,
                undefined,
                ["jpg", "png", "gif", "jpeg", "heic", "webp"]
            )
            console.log("Storage created:");
            console.log("Storage connected"); 
        } catch (error:any) {
            console.log("Error creating the storage try again later :-", error.message);
        }
        console.log("Server Error");
    }
}