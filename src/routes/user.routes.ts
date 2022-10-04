import {Router} from 'express';
import {signUp,signIn, signOut} from '../controllers/auth.controller';
import {getAllUsers, userInfo,  updateUser, deleteUser, follow, unFollow} from '../controllers/user.controller';
import {uploadProfil} from '../controllers/upload.controller';
import multer from 'multer'

const userRouter= Router();
const upload = multer();

//auth
userRouter.post("/register",signUp);
userRouter.post("/login", signIn);
userRouter.get("/logout", signOut);

//users
userRouter.get("/", getAllUsers);
userRouter.get("/:id", userInfo);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);
userRouter.patch("/follow/:id", follow);
userRouter.patch("/unfollow/:id", unFollow);

//upload
userRouter.post("/upload",upload.single('file'), uploadProfil);


export {userRouter};