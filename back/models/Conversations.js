import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    category: { type: String, require: true },
    title: { type: String, require: true },
    thoughts: { type: String, require: true },
    image: { type: String },
    author: { type: String, require: true },
    audio: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "conversations",
  }
);

const ConversationModel = mongoose.model("Conversation", ConversationSchema);
export { ConversationModel };
