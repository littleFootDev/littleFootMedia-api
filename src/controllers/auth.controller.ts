import { RequestHandler } from 'express';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

import {UserModel } from '../models/users/User.models';
import {signUpError, signInErrors} from '../helpers/utils/errors.utils';

dotenv.config();
 const secretToken = process.env.TOKEN_SECRET
 const maxAge :number = 3 * 24 * 60 * 1000;
 const createToken = (id: string) => {
    return jwt.sign({id}, secretToken!, {
        expiresIn : maxAge
    });
 };

const signUp: RequestHandler = async(req, res) => {
    try {
        const body = req.body;
        const user = await UserModel.create(body);
        res.status(201).json({user: user._id});
    } catch (err) {
        const errors = signUpError(err);
        res.status(200).json({err});
    }
};


const signIn: RequestHandler = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});

        if(!user) {
            res.status(201).json({message: 'Email incorrect'})
        } else {
            const isPasswordSame = await user.comparePassword(password);
            if(!isPasswordSame) {
                res.status(200).json({message: 'Password incorrect'});
            }

            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge});
            res.status(201).json({user: user._id});
        }

    } catch (err) {
        const errors = signInErrors(err);
        res.status(200).json({errors});
    }
}

const signOut: RequestHandler =(_, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/')
}
export {signUp, signIn, signOut};