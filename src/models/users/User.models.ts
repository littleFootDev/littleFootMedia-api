import mongoose from 'mongoose';

import {IUser} from '../../interface/user.interface';
import {userSchema} from './User.schema';


const userModel : mongoose.Model<IUser> = mongoose.model('User', userSchema);

export {userModel as UserModel}