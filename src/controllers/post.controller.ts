import { RequestHandler } from 'express';
//import {ObjectId} from 'mongoose';
import fs from 'fs';
import { promisify } from 'util';

import {PostModel} from '../models/posts/Post.models';
import {UserModel} from '../models/users/User.models';
import { uploadErrors } from '../helpers/utils/errors.utils';

const pipeline = promisify(require('stream').pipeline);


const readPost: RequestHandler = async(req, res) => {
    try {
        const posts =  await PostModel.find({}).sort({createdAt: -1});
        return res.status(201).json({ posts});

    } catch (err) {
        return res.status(400).send(err);
    }
};

const createPost: RequestHandler = async(req, res) => {
    let fileName;

    if(req.file !== null) {
        try {
            if(req.file!.detectedMineType !== 'image/jpg',
             req.file!.detectedMineType !== 'image/png', 
             req.file!.detectedMineType !== 'image/jpeg')
                throw Error("Invalid file");

            if(req.file!.size > 500000 )  throw Error("Max size")
        } catch (err) {
            const errors = uploadErrors(err);
            res.status(201).json({errors});
        }
    
        fileName = req.body.posterId + Date.now() + '.jpg';
    }

    await pipeline(
        req.file?.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/posts/${fileName}`
        )
    );




    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [],
    });

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};

const updatePost: RequestHandler = async(req, res) => {
    //if(!ObjectId.isValid(req.params.id))
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    };

    const updatedPost = {
        message: req.body.message,
    };

    PostModel.findByIdAndUpdate(
        req.params.id,
        {$set: updatePost},
        {new: true},
        (err, docs) => {
            if(!err) res.json(docs);
            else console.log("Update error : " + err);
        }
    );

};

const deletePost: RequestHandler = async(req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    };

    PostModel.findByIdAndRemove(
        req.params.id,
        (err: any, docs: any) => {
            if(!err) res.json(docs);
            else console.log("Delete error : " + err);
        }
    )
};

const likePost: RequestHandler = async(req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    };

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet : {likers: req.body.id}
            },
            {new: true},
            (err, _) => {
                if(err) return res.status(400).json({message: err})
            }
        );

        await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet : {likers: req.body.id}
            },
            {new: true},
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err)
            }
        )
    } catch (err) {
        return res.status(400).send(err)
    }
};

const unLikePost: RequestHandler = async(req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    };

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull : {likers: req.body.id}
            },
            {new: true},
            (err, _) => {
                if(err) return res.status(400).json({message: err})
            }
        );

        await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull : {likers: req.body.id}
            },
            {new: true},
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err)
            }
        )
    } catch (err) {
        return res.status(400).send(err)
    }
};

const commentPost: RequestHandler =  (req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    };

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments : {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamps: new Date().getTime()
                    }
                }
            },
            {new: true},
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
};

const editCommentPost: RequestHandler = (req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    };
    try {
        return PostModel.findById(
            req.params.id,
            (err: any, docs: any) => {
                const theComment = docs.comments.find((comment:any) => comment._id.equals(req.body.commentId));

                if(!theComment) return res.status(404).send('Comment not found');
                
                theComment.text = req.body.text;

                return docs.save((err: any) => {
                    if(!err) return res.status(200).json(docs);
                    return res.status(500).send(err);
                })
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
};

const deleteCommentPost: RequestHandler = (req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    };

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
        {
            $pull : {
                comments: {
                    _id: req.body.commentId,
                },
            },
        },
        {new: true},
        (err, docs) => {
            if(!err) return res.send(docs);
            else res.status(400).send(err);
        }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
};


export {readPost, createPost, updatePost, deletePost, likePost, unLikePost, commentPost, editCommentPost, deleteCommentPost};