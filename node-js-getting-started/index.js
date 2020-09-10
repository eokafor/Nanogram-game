const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool(
  {
    //connectionString: 'postgres://postgres:zandox99@localhost/person'
    connectionString: process.env.DATABASE_URL
  }
)

var app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))

app.get('/display', (req,res) => {
  var getAllUser = 'SELECT * FROM person';
  pool.query(getAllUser, (error,result) => {
    if(error){
      res.end(error);
    }
    var results = {'rows':result.rows};
    res.render('pages/display', results);
  });

});

var temp;
app.get('/db', (req,res) => {
  var getAttribute = 'SELECT name,size FROM person';
  pool.query(getAttribute, (error,result) => {
    if(error){
      res.end(error);
    }
    var results = {'rows':result.rows};
    temp = {'rows':result.rows};
    res.render('pages/db', results);
  });

});



app.get('/change/:id', (req,res) => {
  var uid = req.params.id;
  var getID = 'SELECT * FROM person WHERE id = ($1)';
  pool.query(getID, [uid], (error,result) => {
    if(error){
      res.end(error);
    }
    var results = {'rows':result.rows};
    res.render('pages/change', results);
  });

});

app.post('/change', (req,res) => {
    console.log("post request for /adduser")
    var uname1 = req.body.name;
    var size2 = req.body.size;
    var height2 = req.body.height;
    var type2 = req.body.type;
    var dob2 = req.body.DOB;
    var gender2 = req.body.gender;
    var sex1 = req.body.sexuality;
    var ethnic1 = req.body.ethnicity;
    var occup1 = req.body.occupation;
    var changeUser = 'UPDATE person SET name = ($1), size = ($2), height = ($3), type = ($4), dob = ($5), gender = ($6), sexuality = ($7), ethnicity = ($8), occupation = ($9)';
    pool.query(changeUser, [uname1,size2,height2,type2, dob2,gender2,sex1,ethnic1,occup1], (error,result) => {
      if(error){
        res.end(error);
      }
    });
    res.redirect('/display');
});

app.post('/addperson', (req,res) => {
    console.log("post request for /addperson")
    var uname = req.body.name;
    var size1 = req.body.size;
    var height1 = req.body.height;
    var type1 = req.body.type;
    var dob1 = req.body.DOB;
    var gender1 = req.body.gender;
    var sex = req.body.sexuality;
    var ethnic = req.body.ethnicity;
    var occup = req.body.occupation;
    var addAuser = 'INSERT INTO person (id,name,size,height,type,dob,gender,sexuality,ethnicity,occupation) VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9)';
    pool.query(addAuser, [uname,size1,height1,type1,dob1,gender1,sex,ethnic,occup], (error,result) =>{
      if(error){
        res.end(error);
      }
    });
    res.redirect('/people.html');
});

app.post('/deleteperson', (req,res) => {
  console.log("post request for /deleteperson")
  var eid = req.body.id;
  var del = 'DELETE FROM person WHERE id = ($1)';
  pool.query(del, [eid], (error,result)=> {
    if(error){
      res.end(error);
    }
  });
  res.redirect('/deleteperson.html');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
