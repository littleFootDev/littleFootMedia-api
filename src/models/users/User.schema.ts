import mongoose from 'mongoose';
import {hash} from 'bcryptjs';
import isEmail from 'validator'

import { IUser } from '../../interface/user.interface';

const userSchema : mongoose.Schema<IUser> = new mongoose.Schema({
    pseudo: {
        type : String,
        required: true,
        minLength:6,
        maxLength:20,
        unique: true,
        trim: true,
    },
    email: {
        type : String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type : String,
        min: 6,
        max: 20,
    },
    image: {
        type: String,
        default: "assets/uploads/images/profil/random-user.png"
    },
    bio : { 
        type: String,
        max : 1024
    },
    followers: {
        type: [String],
    },
    followin: {
        type: [String],
    },
    likes: {
        type: [String],
    }
},
{
    timestamps: true
}

);

userSchema.pre("save", async function(this: IUser, next) {
    const hashPassword = await hash(this.password, 10);

    this.password = hashPassword;
    next();
})


export {userSchema};

