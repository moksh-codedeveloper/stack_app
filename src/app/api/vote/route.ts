import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { ID } from "node-appwrite";
export async function POST(req: NextRequest) {
  try {
    // grad the data
    const { votedById, voteStatus, type, typeId } = await req.json();
    //list-document
    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
      // Query.equal("voteStatus", voteStatus),
    ]);

    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );
      // decrease the reputation
      const QuestionorAnswer = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionorAnswer.authorId
      );
      await users.updatePrefs<UserPrefs>(QuestionorAnswer.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }

    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteStatus,
          votedById,
        }
      );
      // Increase the reputation or handle the reputation
      const QuestionorAnswer = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionorAnswer.authorId
      );
      // vote is already present or not checking here
      if (response.documents[0]) {
        await users.updatePrefs<UserPrefs>(QuestionorAnswer.authorId, {
          reputation:
            response.documents[0].voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
          //that means the prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
        });
      } else {
        await users.updatePrefs<UserPrefs>(QuestionorAnswer.authorId, {
          reputation:
            voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
          //that means the prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
        });
      }
    }

    

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: (upvotes.total = downvotes.total),
        },
        message: "vote successfully handled",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "error in voting",
      },
      { status: error?.status || error?.code || 500 }
    );
  }
}
