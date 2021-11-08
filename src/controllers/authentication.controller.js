import pool from "../database.js";
import passport from "passport";

var public_key = '6LcisxQdAAAAACQbCj13NdP51JGstBahCoQ3n9Cb';
var secret_key = '6LcisxQdAAAAABx15fNkpAaW5kONj2U0xtr8mBqZ';

const authenticationCtrl = {};

authenticationCtrl.renderLogin = function (req, res, next) {
    res.render('login.hbs', { layout: false });
}

authenticationCtrl.Login = passport.authenticate('local.signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
});

authenticationCtrl.Logout = function (req, res) {
    req.logOut();
    req.flash("success", "You are logged out now.");
    res.redirect('/login');
}

authenticationCtrl.signin = function (req, res) {
    const { email, password } = req.body;
    // req.session.my_variable = 'Hello World!';
    req.session.user_data = { email, password };
    req.flash('success', 'Now You are Registered')
    res.redirect('/profile');
};

authenticationCtrl.register = function (req, res) {
    const { email, password } = req.body;
    // req.session.my_variable = 'Hello World!';
    req.session.user_data = { email, password };
    req.flash('success', 'Now You are Registered')
    res.redirect('/profile');
};

authenticationCtrl.profile = function (req, res) {
    // console.log(req.session.my_variable);
    const user = req.session.user_data;
    delete req.session.user_data;

    res.render('profile', {
        user
    });
};

export default authenticationCtrl;