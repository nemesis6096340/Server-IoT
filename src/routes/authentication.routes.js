import { Router } from "express";

import { isLoggedIn, isNotLoggedIn } from '../lib/authentication.js';
import { reCaptcha } from '../lib/recaptcha.js';
import validation from '../controllers/validator.controller.js';
import authentication from "../controllers/authentication.controller.js";

const router = Router();

router.get('/login',  isNotLoggedIn, authentication.renderLogin);
router.post('/login', isNotLoggedIn, validation.validator('loginUser'), reCaptcha, authentication.Login);

router.get('/signup:access', isNotLoggedIn, authentication.renderSignup);
router.post('/signup', isNotLoggedIn, validation.validator('updateUser'),reCaptcha, authentication.Signup);
router.post('/access-request', isNotLoggedIn, validation.validator('accessRequests'),reCaptcha, authentication.AccessRequest);

router.get('/forgot', isNotLoggedIn, authentication.renderForgot);
router.post('/forgot',isNotLoggedIn, validation.validator('loginUser'), reCaptcha, authentication.Forgot);

router.get('/profile', isLoggedIn, authentication.renderProfile);
//router.post('/profile',isLoggedIn, validation.validator('loginUser'), reCaptcha, authentication.Profile);

router.get('/logout', isLoggedIn, authentication.Logout);

export default router;