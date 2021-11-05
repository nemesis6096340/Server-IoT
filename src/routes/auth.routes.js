import { Router } from "express";
const router = Router();

import passport from "passport";
/*import passportConfig from "./config/passport";*/
//passportConfig(passport);

import { isLoggedIn } from '../lib/authentication.js';

`
{
  "profile": {
    "fullname": "Huber Acarapi Mamani",
    "telephone": 76765486
  },
  "admin": {
    "user": {
      "viewer": true,
      "create": true,
      "update": true,
      "delete": false
    },
    "facilities": {
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "production":{
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "datalogers":{
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "fieldbus":{
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    }
  }
}
`
router.get('/login', function (req, res, next) {
  res.render('login.hbs',{layout: false});
});

router.post('/login', passport.authenticate('local.signin', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function (req, res) {
  req.logOut();
  req.flash("success", "You are logged out now.");
  res.redirect('/login');
});

router.get('/profile', isLoggedIn, function (req, res) {
  //res.render('profile');
  res.send("Profile");
});


router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

export default router;