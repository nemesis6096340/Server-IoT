import pool from "../database.js";
import fs from "fs";

const linkCtrl = {};
var capture = {
    "units":[],
    "balances": [],
    "filters":[],
    "ports":[]

};

linkCtrl.config = async function(req, res){
    const rows = await pool.query("call listBalances();");
    const balances = Object.values(JSON.parse(JSON.stringify(rows[0])));
    //console.log(balances);
    res.render("capture/config.hbs", {balances});
};

//Load configurations
linkCtrl.load = function(req, res){
    //res.send(JSON.stringify(capture));
    capture.units = pool.querySync("call listUnits();");
    capture.balances = pool.querySync("call listBalances();");
   //console.log(capture);
};

linkCtrl.fbus = function(req, res) {
    console.log(req.connection.remoteAddress.split(`:`).pop());
    console.log(req.query);
    data = JSON.stringify(req.query);
    res.send(data);
    //console.log(Math.floor(new Date().getTime()/1000.0) );
    console.log(data);
    var obj = JSON.parse(data);    
      
    var index = capture.findIndex(x => x.id === parseInt(obj.id,10))
    var match = new Object();
    
    match.value = obj.rx.match(new RegExp("[-+.0-9]", "g"));  
    var filter = capture[index].settings.filter;
    if(filter.value.enable){
        match.value = obj.rx.match(new RegExp(filter.value.match,"g"));
        //console.log(new RegExp(filter.value.match,"g")); 
        //console.log(match.value);
    }  
    if(match.value!=null){
        
        var value = parseFloat(match.value.join(''));
        //console.log(value);
        match.net = obj.rx.match(new RegExp(filter.net.match,"g"));        
        match.tare = obj.rx.match(new RegExp(filter.tare.match,"g"));
        match.gross = obj.rx.match(new RegExp(filter.gross.match,"g"));

        if(filter.net.enable && match.net!=null){
            capture[index].data.net = value;         
        }else if(filter.tare.enable && match.tare!=null){
            capture[index].data.tare = value;
        }else if(filter.gross.enable && match.gross!=null){
            capture[index].data.gross = value;
            if(capture[index].data.net==0 || capture[index].data.tare==0 )
                capture[index].data.net = capture[index].data.gross;
        }else if(!filter.value.enable){
            capture[index].data.net = value;
            capture[index].data.tare = 0;
            capture[index].data.gross = value;
        }
        if(!filter.net.enable)      capture[index].data.net = capture[index].data.gross - capture[index].data.tare;
        //if(!filter.tare.enable)     capture[index].data.tare  = capture[index].data.gross - capture[index].data.net;
        if(!filter.tare.enable)     capture[index].data.tare  = 0;
        if(!filter.gross.enable)    capture[index].data.gross = capture[index].data.net   + capture[index].data.tare;

        capture[index].data.time = Math.floor(new Date().getTime()/1000.0) ;
        console.log(JSON.stringify(capture[index].data));

        fs.writeFile('//srvwinsap/pesaje/'+capture[index].data.id+".txt", JSON.stringify(capture[index].data), function (err) {
            if (err) return console.log(err);
            //console.log('write successfully');
        });
        /*fs.writeFile('//172.16.10.165/pesaje/'+capture[index].data.id+".txt", JSON.stringify(capture[index].data), function (err) {
            if (err) return console.log(err);
        });*/
    }
    res.end();
    //console.log(find.settings.filter);
};

export default linkCtrl;