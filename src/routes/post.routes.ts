import {Router} from 'express';
import {readPost, createPost, updatePost, deletePost, likePost, unLikePost, commentPost, editCommentPost, deleteCommentPost} from '../controllers/post.controller';

const postRouter = Router();

postRouter.get('/', readPost);
postRouter.post('/', createPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);
postRouter.patch('/like-post/:id', likePost);
postRouter.patch('/unlike-post/:id', unLikePost);

// comments route
postRouter.patch('/comments-post/:id', commentPost);
postRouter.patch('/edit-comments-post/:id', editCommentPost);
postRouter.patch('/delete-comments-post/:id', deleteCommentPost);



export {postRouter};