const express = require('express');
const app = express();
const fs = require('fs');
const mongoDbClient = require('./mongo.connector')



const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var morgan = require('morgan');
var logFile = fs.createWriteStream('./api.log', {flags: 'a'});
app.use(morgan('combined', { stream: logFile }));


mongoDbClient.init()
    .then(db => {

    app.get('/user', function(req, res){
            var content = fs.readFileSync('user.json');
            var obj = JSON.parse(content);
            
            db.collection("user").find().toArray(function (error, results) {
            res.send(JSON.stringify(results));
        })
        
    })

    app.get( '/items', function(req,res){
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        res.send(obj.items);
        
    });

    app.get( '/list', function(req,res){
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        res.send(obj.list);
        
    });

    app.post('/adduser', function(req,res) {
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjUser=obj.user;

        var name = req.body.name;
        var password = req.body.password;
        var id = ObjUser.length +1;
        var NewObj = {"name" : name, "password" : password, "id" : id};

        ObjUser.push(id=id, name=name, password=password);
        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been created!');
          });

        db.collection("user").insert(NewObj)
        res.send(JSON.stringify(NewObj))
    });


    app.post('/additem', function(req,res) {
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjItems=obj.items;

        var label = req.body.label;
        var image = req.body.images;
        var description = req.body.description;
        var id = ObjItems.length +1;
        
        ObjItems.push(id=id, label=label, image=image, description=description);
        res.send(obj);
        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been created!');
          });
        
    });

    app.post('/addlist', function(req,res) {
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjList=obj.list;

        var name = req.body.name;
        var user = req.body.user;
        var items = req.body.items;
        var id = ObjList.length +1;

        ObjList.push(id=id, name=name, user=user, items=items);
        res.send(obj);
        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been created!');
          });
        
    });

    app.put('/updateuser', function(req,res) {
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjUser = obj.user;

        var name = req.body.name;
        var password = req.body.password;
        var id = ObjUser.length +1;

        var element = ObjUser.find(function(element) {
            return element === req.body.id });

        ObjUser.splice(ObjUser.indexOf(element), {
            id : req.body.id,
            name : name,
            password : password
        });
        
        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been updated!');
        })
    });

    app.put('/updateitems', function(req,res) {
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjItems = obj.items;

        var element = ObjItems.find(function(element) {
            return element === req.body.id });
        var label = req.body.label;
        var image = req.body.images;
        var description = req.body.description;
        var id = ObjItems.length +1;
        
        ObjItems.splice(ObjItems.indexOf(element), {
            id : req.body.id, label : label, image : image, description : description});
        
        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been updated!');
        })
    
    });

    app.put('/updatelist', function(req,res) {
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjList = obj.list;

        var element = ObjList.find(function(element) {
            return element === req.body.id });
       
        var name = req.body.name;
        var user = req.body.user;
        var items = req.body.items;
        var id = ObjList.length +1;
    
        ObjList.splice(ObjList.indexOf(element), {
            id : req.body.id,
            name : name,
            user : user,
            items : items
        });
        
        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been updated!');
        })
    });
     
    app.delete('/deleteuser', function(req,res){
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjUser = obj.user;

        var element = ObjUser.find(function(element) {
            return element === req.body.id });

        ObjUser.splice(ObjUser.indexOf(element), 1)

        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been delete!');
        })
    })

    app.delete('/deleteitems', function(req,res){
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjItems = obj.items;

        var element = ObjItems.find(function(element) {
            return element === req.body.id });

        ObjItems.splice(ObjItems.indexOf(element), 1)

        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been delete!');
        })
    })

    app.delete('/deletelist', function(req,res){
        var content = fs.readFileSync('user.json');
        var obj = JSON.parse(content);
        var ObjList = obj.list; 

        var element = ObjList.find(function(element) {
            return element === req.body.id });

        ObjList.splice(ObjList.indexOf(element), 1)

        fs.writeFile('user.json',JSON.stringify(obj), (err) => {
            if (err) throw err;
            console.log('The file has been delelte!');
        })
    })
    app.listen(3000, () => {
        console.log('App listening on port 3000')
    }) 
})
.catch(err => {
    console.log("error init")
})

     
