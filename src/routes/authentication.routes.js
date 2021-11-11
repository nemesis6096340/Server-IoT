import { Router } from "express";


const router = Router();

/*import passportConfig from "./config/passport";*/
//passportConfig(passport);

import { isLoggedIn, isNotLoggedIn } from '../lib/authentication.js';
import authentication from "../controllers/authentication.controller.js";

router.get('/login', isNotLoggedIn, authentication.renderLogin);
router.post('/login', isNotLoggedIn, authentication.validator('loginUser') , authentication.reCaptcha, authentication.Login);
router.get('/logout', isLoggedIn, authentication.Logout);

/*
router.get('/profile', isLoggedIn, function (req, res) {
  res.send("Profile");
});

*/

/*
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));*/

router.post('/signup', isNotLoggedIn, authentication.validator('accessRequests') ,authentication.Signup);

export default router;