import { RequestHandler } from 'express';
//import {ObjectId} from 'mongoose';

import {PostModel} from '../models/posts/Post.models';
import {UserModel} from '../models/users/User.models';


const readPost: RequestHandler = async(req, res) => {
    try {
        const posts =  await PostModel.find({});
        return res.status(201).json({ posts});

    } catch (err) {
        return res.status(400).send(err);
    }
};

const createPost: RequestHandler = async(req, res) => {
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
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


export {readPost, createPost, updatePost, deletePost};