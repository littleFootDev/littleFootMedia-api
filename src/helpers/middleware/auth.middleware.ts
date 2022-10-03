import { RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

import {UserModel} from '../../models/users/User.models'

const checkUser: RequestHandler = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET!, async(err: any, decodedToken: any) => {
            if(err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

export {checkUser}