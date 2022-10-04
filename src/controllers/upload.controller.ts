import { RequestHandler } from 'express';
import fs from 'fs';
import { promisify } from 'util';

import { UserModel } from '../models/users/User.models';
import {uploadErrors} from '../helpers/utils/errors.utils'

const pipeline = promisify(require('stream').pipeline);


const uploadProfil : RequestHandler = async(req, res) => {
    try {
        if(req.file!.detectedMineType !== 'image/jpg', req.file!.detectedMineType !== 'image/png', req.file!.detectedMineType !== 'image/jpeg')
            throw Error("Invalid file");
        if(req.file!.size > 500000 )  throw Error("Max size")
    } catch (err) {
        const errors = uploadErrors(err);
        res.status(201).json({errors});
    }

    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file?.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {$set : {picture: "./uploads/profil/" + fileName}},
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(500).send({message: err});
            }
        );
    } catch (err) {
        res.status(500).send({message :err});
    }
};


export {uploadProfil}