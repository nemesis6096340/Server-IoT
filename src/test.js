import express from "express";
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res){
    res.send('Hola pendejos');
});

app.listen(port, function(){
    console.log(`Example app listening at http://localhost:${port}`);
});

