import { RequestHandler } from 'express';
import {UserModel } from '../models/users/User.models'

const signUp: RequestHandler = async(req, res) => {
    try {
        const body = req.body;
        const user = await UserModel.create(body);
        res.status(201).json({user: user._id});
    } catch (err) {

        res.status(200).send({err});
    }
};

export {signUp};