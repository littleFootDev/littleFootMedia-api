import mongoose from 'mongoose';

import {IPost} from '../../interface/post.interface';
import  {postSchema} from './Post.schema';


const postModel: mongoose.Model<IPost> = mongoose.model('Post', postSchema);

export {postModel as PostModel};