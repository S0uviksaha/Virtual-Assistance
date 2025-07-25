import express, { Router } from 'express';
import { logIn, signUp } from '../controllers/auth.controller.js';

const authRouter = express.Router(Router);

authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);

export default authRouter;