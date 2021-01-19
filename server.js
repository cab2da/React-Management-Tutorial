const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

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
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.get('/api/customers', (req, res) => {
    connection.query(
        "select * from customer",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));