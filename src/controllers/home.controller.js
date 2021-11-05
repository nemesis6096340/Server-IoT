const homeCtrl = {};

homeCtrl.renderHome = function(req, res) {
    res.render('home.hbs');
};

export default homeCtrl;