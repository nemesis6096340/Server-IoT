import pool from "../../database.js";

const authCtrl = {};

authCtrl.signin = function(req, res) {
    const { email, password } = req.body;
    // req.session.my_variable = 'Hello World!';
    req.session.user_data = {email, password};
    req.flash('success', 'Now You are Registered')
    res.redirect('/profile');
};

authCtrl.register = function(req, res) {
    const { email, password } = req.body;
    // req.session.my_variable = 'Hello World!';
    req.session.user_data = {email, password};
    req.flash('success', 'Now You are Registered')
    res.redirect('/profile');
};

authCtrl.profile = function(req, res){
    // console.log(req.session.my_variable);
    const user = req.session.user_data;
    delete req.session.user_data;

    res.render('profile', {
        user
    });
};

export default authCtrl;