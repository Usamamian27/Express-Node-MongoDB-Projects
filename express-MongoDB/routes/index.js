const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const assert = require('assert');


const url = 'mongodb://localhost:27017';

const dbName = 'test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/get-data',(req,res,next)=> {


    const resultArray =[];
    MongoClient.connect(url, (err,client)=> {

        assert.equal(null,err);
        console.log('Connection Successful');

        const db = client.db(dbName);

        const cursor = db.collection('user-data').find();
        cursor.forEach( (doc ,err)=> {
            assert.equal(null,err);
            resultArray.push(doc);
        },
             ()=> {
                client.close();
                res.render('index',{items:resultArray})
            })

    })


});

router.post('/insert',(req,res,next)=> {

    const item = {
        title : req.body.title,
        content:req.body.content,
        author: req.body.author

    }

    MongoClient.connect(url, (err,client)=> {

        assert.equal(null,err);
        console.log('Connection Successful');

        const db = client.db(dbName);

        db.collection('user-data').insertOne(item,(err,result)=>{

            assert.equal(null,err);
            console.log('Item Inserted');
            client.close();

        })
    })



});

router.post('/update',function (req,res,next) {

    const item = {
        title : req.body.title,
        content:req.body.content,
        author: req.body.author

    }

    const id = req.body.id;

    MongoClient.connect(url, (err,client)=> {

        assert.equal(null,err);
        console.log('Connection Successful');

        const db = client.db(dbName);

        db.collection('user-data').updateOne({"_id":ObjectID(id)},{$set : item},(err,result)=>{

            assert.equal(null,err);
            console.log('Item updated');
            client.close();

        })
    })


});

router.post('/delete',function (req,res,next) {

    const id = req.body.id;

    MongoClient.connect(url, (err,client)=> {

        assert.equal(null,err);
        console.log('Connection Successful');

        const db = client.db(dbName);

        db.collection('user-data').deleteOne({"_id":ObjectID(id)},(err,result)=>{

            assert.equal(null,err);
            console.log('Item deleted');
            client.close();

        })
    })
});


module.exports = router;
