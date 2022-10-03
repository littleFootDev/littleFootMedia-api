import mongoose, {Types} from 'mongoose';

export interface IPost extends mongoose.Document {
   posterId: string;
   message: string;
   picture?: string;
   video?: string;
   likers: string[];
   comments: {commenterId: string, commenterPseudo: string, text: string, timestamps: number}[];
}