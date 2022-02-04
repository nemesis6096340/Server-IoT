import pool from "../../database.js";

const usersCtrl = {};

usersCtrl.list = function(req,res){
    console.log(req.user.id);
    res.render('admin/users/list.hbs');
};

export default usersCtrl;