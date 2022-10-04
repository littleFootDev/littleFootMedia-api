import express from 'express';
import dotenv from 'dotenv';
import {json} from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {userRouter} from './routes/user.routes'
import {checkUser, requireAuth} from './helpers/middleware/auth.middleware'
import {postRouter} from './routes/post.routes';

dotenv.config();
const port = process.env.PORT;
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credential: true,
    'allowedHeaders' : ['sessionId', 'Content-Type'],
    'exposedHeaders' : ['sessionId'],
    'methods' : 'GET, POST, PUT, DELETE, PATCH, HEAD',
    'preflightContinue' : false
}

async function serverSetup() {
    const app:express.Application = express();
    await startServer(app);
    await middleware(app);
};

function middleware(app: express.Application) {
    app.use(cors(corsOptions));
    app.use(json());
    app.use(cookieParser());
    app.get('*', checkUser);
    app.get('/jwtid', requireAuth, (req, res) => {
        res.status(200).send(res.locals.user._id);
    });
    app.use("/api/users", userRouter);
    app.use('/api/post', postRouter)
}

async function startServer(app:express.Application) {
    try {
        const serverStarted: Promise<void> = new Promise<void>(resolve => {
            app.listen(port, resolve);
        });
        await serverStarted;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export {serverSetup};