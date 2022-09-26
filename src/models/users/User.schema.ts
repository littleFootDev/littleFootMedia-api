import mongoose from 'mongoose';
import { IUser } from '../../interface/user.interface';

const userSchema : mongoose.Schema<IUser> = new mongoose.Schema({
    pseudo: {type : String},
    password: {type : String},
    email: {type : String},
});


export {userSchema};

