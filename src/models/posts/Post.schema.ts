import mongoose from 'mongoose';

import { IPost } from '../../interface/post.interface';

const postSchema: mongoose.Schema<IPost> = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      trim: true,
      required: true
    },
    picture: {
      type: String
    },
    video: {
      type: String
    },
    likers: {
      type: [String],
      required: true
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamps: Number
        }
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export { postSchema };
