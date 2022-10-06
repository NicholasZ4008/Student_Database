const express = require('express')
const res = require('express/lib/response')
const path = require('path')
const PORT = process.env.PORT || 5000

const {Pool} = require('pg')

var pool = new Pool({
  
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }

  //connectionString: process.env.DATABASE_URL || 'postgres://postgres:gamemaster@localhost/students'
})

app = express()


app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/display', (req,res) => {
  var getStudentQuery = `SELECT * FROM student`;
  pool.query(getStudentQuery, (error,result)=> { //if error
    if(error)
      res.end(error) //end the query
    var results = {'rows':result.rows}//pass an array of the results of these rows that are set
    res.render('pages/display',results);//render db.ejs
  }) 
});

//show the main page of student database
app.get('/', (req,res) => {
  var getStudentQuery = `SELECT * FROM student`; //query the database
  pool.query(getStudentQuery, (error,result) => {
    if (error)
      res.end(error);
    var results = {'rows':result.rows}
    res.render('pages/index',results)
  })
});


app.get('/addStudent', (req, res) => {
  res.render('pages/addStudent');
})

app.post('/addStudent',(req,res)=>{  
  if(!(!req.body.uname || !req.body.uweight|| !req.body.uheight || !req.body.uhair || !req.body.ugpa)){
    //putting the user in the database
    var username = req.body.uname
    var weight = req.body.uweight
    var height = req.body.uheight
    var hair = req.body.uhair
    var gpa = req.body.ugpa

    var addStudentQuery = `INSERT INTO student values ('${username}', ${weight}, ${height}, '${hair}', ${gpa});`;
      pool.query(addStudentQuery, (error,result) =>{
        if(error)
          {res.end(error);}
        res.redirect('/');
      })
  }
  else{
    res.send(`<script>alert("Please Fill In All Parameters"); window.location.href = "/addStudent"; </script>`);//if error hyperlink back to add user page
  }
})

app.get('/student/:id', (req,res) =>{
  let studentID = req.params.id;
  var getStudentQueryID = `SELECT * FROM student where id=${studentID}`;
  pool.query(getStudentQueryID, (error, result) =>{
    if(error){res.end(error);}

    var results = {'rows':result.rows}
    //console.log(results);

    //let hair = results.rows[0]["hair"];
    res.render('pages/studentid', results);
  })
})

//change the student info
app.get('/changeInfo/:studentID', (req,res) =>{
  let id = req.params.studentID;
  var getStudentQueryID = `SELECT * FROM student where id=${id}`;
  
  pool.query(getStudentQueryID, (error, result) =>{
    if(error){res.end(error);}

    var results = {'rows':result.rows}
    //let hair = results.rows[0]["hair"];
    res.render('pages/changeInfo', results);
  })
})

app.post('/changeInfo/:studentID', (req, res) =>{
  if(req.body.uname){
    pool.query(`UPDATE student SET name='${req.body.uname}' WHERE id=${req.params.studentID};`);
  }
  if(req.body.uweight){
    pool.query(`UPDATE student SET weight=${req.body.uweight} WHERE id=${req.params.studentID};`);
  }
  if(req.body.uheight){
    pool.query(`UPDATE student SET height=${req.body.uheight} WHERE id=${req.params.studentID};`);
  }
  if(req.body.uhair){
    pool.query(`UPDATE student SET hair='${req.body.uhair}' WHERE id=${req.params.studentID};`);
  }
  if(req.body.ugpa){
    pool.query(`UPDATE student SET gpa=${req.body.ugpa} WHERE id=${req.params.studentID};`);
  }
  res.redirect('/');
})

app.post('/deleteStudent/:studentID', (req, res) =>{
  pool.query(`DELETE FROM student WHERE id='${req.params.studentID}'`);
  res.redirect('/');
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

