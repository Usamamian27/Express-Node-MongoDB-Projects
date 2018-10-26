const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userDataSchema = new Schema({
    title: String,
    content:String,
    author:String
},{collection : 'user-data'});

const UserData = mongoose.model('UserData', userDataSchema);



// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/test')
    .then(function(){  console.log('MongoDB Connected...');})
    .catch(function (err) { console.log(err);});








/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/get-data',(req,res,next)=> {
    UserData.find()
        .then((doc)=>{
            res.render('index',{items:doc})
        });

});




router.post('/insert',(req,res,next)=> {

    const item = {
        title : req.body.title,
        content:req.body.content,
        author: req.body.author

    }

    const data = new UserData(item);
    data.save();



    res.redirect('/');


})

    router.post('/update',function (req,res,next) {

        const item = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author

        }

        const id = req.body.id;
        UserData.findById(id, (err, doc) => {
            if (err) {
                console.log('Error, No entry found');
            } else {
                doc.title = req.body.title,
                    doc.content = req.body.content,
                    doc.author = req.body.author

                doc.save();
            }

        })
    });
    router.post('/delete', function (req, res, next) {
        const id = req.body.id;

        UserData.findByIdAndRemove(id).exec();

        res.redirect('/');

        });




module.exports = router;
