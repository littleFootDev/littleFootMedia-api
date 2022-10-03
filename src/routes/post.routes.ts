import {Router} from 'express';
import {readPost, createPost, updatePost, deletePost, likePost, unLikePost,} from '../controllers/post.controller';

const postRouter = Router();

postRouter.get('/', readPost);
postRouter.post('/', createPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);
postRouter.patch('/like-post/:id', likePost);
postRouter.patch('/unlike-post/:id', unLikePost);


export {postRouter};