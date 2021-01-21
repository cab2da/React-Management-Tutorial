const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const mysql = require('mysql');
const multer = require('multer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* app.get('/api/customers', (req, res) => {
    res.send([
        {  'id': 1, 'image': 'https://placeimg.com/64/64/1', 'name': '홍길동',  'birthday': '961222',  'gender': '남자',  'job': '대학생'},
        {  'id': 2, 'image': 'https://placeimg.com/64/64/2', 'name': '심순애',  'birthday': '980102',  'gender': '여자',  'job': '대학원생'},
        {  'id': 3, 'image': 'https://placeimg.com/64/64/3', 'name': '이영애',  'birthday': '950102',  'gender': '여자',  'job': '연예인'}
      
    ]);
}); */

// db 연결하기
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

const upload = multer({dest: './upload'});

app.get('/api/customers', (req, res) => {
    connection.query(
        "SELECT * FROM customer WHERE isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    //let image = '/image/' + req.file.filename; // 입력은 되는데 불러오질 못해서 아래처럼 임시로 처리
    let image = 'http://localhost:5000/image/' + req.file.filename;
    //let image = '/upload/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, ?, ?)';
    let params = [image, name, birthday, gender, job, now(), 0]
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.delete('/api/customers/:id', (req, res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }    
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));