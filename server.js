const express = require('express');   //load express library into file
const mysql = require('mysql'); //load mysql library
const mysqlcredentials = require('./mysqlcreds.js'); //load the credentials from a local file for mysql
const cors = require('cors');

//using credentials we loaded, establish a preliminary connection to the database
const db = mysql.createConnection(mysqlcredentials);
const server = express(); 
server.use(express.json());
server.use(cors());
server.use(express.static(__dirname + '/html'));
//middleware
server.use(express.urlencoded({extended: false}));
//have express pull body bpdy data that is urlencoded and place it into an object called "body"

//make an endpoint to handle retrieving the grades of all students
server.get('/api/grades', (req, res)=> {
            //establish direct connection to the database and call the callback function when connection is made

    db.connect(()=>{
            //create a query for our desired operation
        const query = 'SELECT `id`, CONCAT(`givenname`," ",`surname`) AS `name`, `course`, `grade` FROM `grades`';
            //send the query to the database and call the given callback function once the data is retrieved or an error happens
        db.query(query, (error, data)=>{
            //if error is null. no error occurred
            //create an output object to be sent back to the client
            const output = {
                success: false,
            }
            //if error is null, send the data
            if(!error){
                //notify the client that we were successful
                output.success = true;
                //attach the data from the database to the output object
                output.data = data;
                    //key and value is both data
            }
            else{
                //an error occurred, attach that error onto the output so we can see what happened
                    output.error = error;
                };
            //send data back to the client
                res.send(output);
        })
    })
})

// INSERT INTO `grades` SET `surname`=`Dan`, `givenname`= "Paschal", course`="math", `grade`=80
//INSERT INTO `grades` (`surname`, `givenname`, `course`, `grade`) VALUES ("Paschal", "Dan", "math", 80)
//^ advantage you can put multiple values at the same time


server.post('/api/grades', (req, res)=>{
    //check the body object and see if any data was not sent
    if(req.body.name === undefined || req.body.course ===undefined || req.body.grade===undefined){
        //respond to the client with an appropriate error message
        res.send({
            success: false,
            error: 'invalid name, course, or grade'
        })
        return;
    }
    //connect to database
    db.connect(()=>{

        const name = req.body.name.split(" ");
        //conatenating a string for use in mysql and gluing it together in a query
        const query = 'INSERT INTO `grades` SET `surname`="'+name.slice(1).join(' ')+'", `givenname`="'+name[0]+'", `course` = "'+req.body.course+'", `grade` = '+req.body.grade+', `added`=NOW()';

        db.query(query, (error, result)=>{
            if(!error){
                res.send({
                    success: true,
                    new_id: result.insertId
                })
            }
        })
        console.log(query);
    })
})

server.delete('/api/grades/:student_id', (req, res)=>{
    if(req.params.student_id=== undefined){
        res.send({
            success: false,
            error: 'must provide a student id for delete'
        });
        return;
    }
    db.connect(()=>{
    const query = 'DELETE FROM `grades` WHERE `id` = '+req.params.student_id+'';
        db.query(query, (error, result)=>{
            if(!error){
                res.send({
                    success: true,
                })
            }else{
                res.send({
                    success: false,
                })
            }
        })
    })
})


server.listen(3001, ()=>{
    console.log('Battlecruiser Operational');
})
//where am i setting up shop and what am i going to call when i'm set 
