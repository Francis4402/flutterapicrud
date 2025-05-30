import { model, Schema } from "mongoose";
import { TPost } from "./post_interface";


const PostSchema = new Schema<TPost>({
    title: {
      type: String,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: false,
      default: [],
    },
  }, {
    timestamps: true,
});
  

export const PostModel = model<TPost>('posts', PostSchema);