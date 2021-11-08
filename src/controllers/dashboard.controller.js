const dashboardCtrl = {};

dashboardCtrl.monit = function(req, res) {
    res.render('dashboard.hbs');
};

export default dashboardCtrl;