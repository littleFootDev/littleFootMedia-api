import {Router} from 'express';
import {signUp,signIn, signOut} from '../controllers/auth.controller';
import {getAllUsers, userInfo,  updateUser, deleteUser, follow, unFollow} from '../controllers/user.controller';

const userRouter= Router();

userRouter.post("/register",signUp);
userRouter.post("/login", signIn);
userRouter.get("/logout", signOut);


userRouter.get("/", getAllUsers);
userRouter.get("/:id", userInfo);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);
userRouter.patch("/follow/:id", follow);
userRouter.patch("/unfollow/:id", unFollow);
export {userRouter};