import { RequestHandler } from 'express';

import { IUser } from '../interface/user.interface';
import {UserModel} from '../models/users/User.models';

const getAllUsers: RequestHandler = async(req, res) => {
    try {
        const users = await UserModel.find({}).select('-password');

        res.status(200).json({users})
    } catch (err) {
        res.status(200).json({err});
    }
};

const userInfo : RequestHandler = async(req, res) => {
     if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
     }

     UserModel.findById(req.params.id, (err: Error, doc: IUser) => {
        if(!err) res.send(doc);
        else console.log('ID Unknown : ' + err);  
     }).select('-password');
};

const updateUser: RequestHandler = async(req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    }
    try {
        await UserModel.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }  
            },
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (err, doc) => {
                if(!err) return res.status(201).json(doc);
                if(err) return res.status(500).json({message: err})
            }
        );
    } catch (err) {
        return res.status(500).json({message : err});
    }
};

const deleteUser: RequestHandler = async(req, res) => {
    if(!req.params.id) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    }
    try {
       
        await UserModel.deleteOne(
            {_id: req.params.id} 
        )
        res.status(200).json({message: 'Successfully deleted'});
    } catch (err) {
        return res.status(500).json({message : err});
    }
};

const follow: RequestHandler = async(req, res) => {
    if(!req.params.id || !req.body.idToFollow) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    }

    try {
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: {followin: req.body.idToFollow}},
            {new: true, upsert: true,},
            (err, doc) => {
                if(!err) res.status(201).json(doc);
                if(err) return res.status(400).json({message: err})
            }
        );

        await UserModel.findByIdAndUpdate(
            req.params.idToFollow,
            {$addToSet: {followers: req.body.id}},
            {new: true, upsert: true,},
            (err, doc) => {
                if(err) return res.status(400).json({message: err})
            }
        );
    } catch (err) {
        return res.status(500).json({message : err});
    }
}
const unFollow: RequestHandler = async(req, res) => {
    if(!req.params.id || !req.body.idToUnFollow) {
        return res.status(400).json('ID Unknown : ' + req.params.id);
    }

    try {
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {$pullt: {followin: req.body.idToUnFollow}},
            {new: true, upsert: true,},
            (err, doc) => {
                if(!err) res.status(201).json(doc);
                if(err) return res.status(400).json({message: err})
            }
        );

        await UserModel.findByIdAndUpdate(
            req.params.idToUnFollow,
            {$pull: {followers: req.body.id}},
            {new: true, upsert: true,},
            (err, doc) => {
                if(err) return res.status(400).json({message: err})
            }
        );
    } catch (err) {
        return res.status(500).json({message : err});
    }
}

export {getAllUsers, userInfo, updateUser, deleteUser, follow, unFollow}