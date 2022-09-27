import mongoose, {Types} from 'mongoose';

export interface IUser extends mongoose.Document {
    id: Types.ObjectId;
    pseudo: string;
    password: string;
    email: string;
    image?: string;
    bio?: string;
    followers?: string[];
    followin?: string[];
    likes?: string[];
}