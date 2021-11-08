const homeCtrl = {};

homeCtrl.renderHome = function(req, res) {
    res.render('home.hbs',{layout:false});
};

export default homeCtrl;