import {Router} from 'express';
import {readPost, createPost, updatePost, deletePost} from '../controllers/post.controller';

const postRouter = Router();

postRouter.get('/', readPost);
postRouter.post('/', createPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);

export {postRouter};