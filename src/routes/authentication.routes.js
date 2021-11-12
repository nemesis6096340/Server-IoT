import { Router } from "express";

import { isLoggedIn, isNotLoggedIn } from '../lib/authentication.js';
import { reCaptcha } from '../lib/recaptcha.js';
import validation from '../controllers/validator.controller.js';
import authentication from "../controllers/authentication.controller.js";

const router = Router();

router.get('/login',  isNotLoggedIn, authentication.renderLogin);
router.post('/login', isNotLoggedIn, validation.validator('loginUser'), reCaptcha, authentication.Login);
router.post('/signup', isNotLoggedIn, validation.validator('accessRequests'),reCaptcha, authentication.Signup);

router.get('/logout', isLoggedIn, authentication.Logout);
/*
router.get('/profile', isLoggedIn, function (req, res) {
  res.send("Profile");S
});

*/

/*
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));*/

export default router;