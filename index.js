const express = require('express');
const bodyParser = require('body-parser');
const {pool} = require('./services/db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// Add route code Here
app.get('/', (req, res) => {
  res.send('Welcome to Our SCHOOL API');
});

app.get('/student', (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM students';
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({error})
      } 
      if(result.rows < '1') {
        res.status(404).send({
        status: 'Failed',
        message: 'No student information found',
        });
      } else {
        res.status(200).send({
        status: 'Successful',
        message: 'Students Information retrieved',
        students: result.rows,
        });
      }
    });
  });
});

app.post('/student', (req, res) => {
  const data = {
    name : req.body.studentName,
    age : req.body.studentAge,
    classroom : req.body.studentClass,
    parents : req.body.parentContact,
    admission : req.body.admissionDate,
  }
  
  pool.connect((err, client, done) => {
    const query = 'INSERT INTO students(student_name,student_age, student_class, parent_contact, admission_date) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const values = [data.name, data.age, data.classroom, data.parents, data.admission];

    client.query(query, values, (error, result) => {
      done();
      if (error) {
        res.status(400).json({error});
      }
      res.status(202).send({
        status: 'SUccessful',
        result: result.rows[0],
      });
    });
  });

});


app.get('/student/:id', (req,res) => {
  pool.connect((err, client, done) => {
  const id = req.params.id;
  const query = `SELECT * FROM students where id=${id}`;
  client.query(query, (error, result) => {
    done();
    if (error) {
      res.status(400).json({error})
    } 
    if(result.rows < '1') {
      res.status(404).send({
      status: 'Failed',
      message: 'No student information found',
      });
    } else {
      res.status(200).send({
      status: 'Successful',
      message: 'Students Information retrieved',
      students: result.rows,
      });
    }
  });
});
});


app.post('/student/update/:id', (req, res) => {
  const data = {
    name : req.body.studentName,
    age : req.body.studentAge,
    classroom : req.body.studentClass,
    parents : req.body.parentContact,
    admission : req.body.admissionDate,
  }
  
  pool.connect((err, client, done) => {
    const id = req.params.id;
    const query = `UPDATE students set student_name=$1 ,student_age=$2,student_class=$3,parent_contact=$4, admission_date=$5 where id=${id}`;
    const values = [data.name, data.age, data.classroom, data.parents, data.admission];

    client.query(query, values, (error, result) => {
      done();
      if (error) {
        res.status(400).json({error});
      }
      res.status(202).send({
        status: 'SUccessful Update',
        result: result.rows[0],
      });
    });
  });

});


app.delete('/delstudent/:id', (req,res) => {
  pool.connect((err, client, done) => {
  const id = req.params.id;
  const query = `DELETE FROM students where id=${id}`;
  client.query(query, (error, result) => {
    done();
    if (error) {
      res.status(400).json({error})
    } 
    else {
      res.status(200).send({
      status: 'Successful',
      message: 'Students Information remove',
      students: result.rows,
      });
    }
  });
});
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`We are live at 127.0.0.1:${port}`);
});