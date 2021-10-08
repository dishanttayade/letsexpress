const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const bparser = require('body-parser')
const sqlite3 = require('sqlite3')
const port = 3009

app.use(bparser.urlencoded({extended:false}));
app.listen(port, ()=>{
    console.log(`The server is working at ${port}`)
});

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/newproject', (req, res) =>{
    res.render('addproject')
})

app.get('/contact', (req, res)=>{
    res.render('contact')
})

// app.get('/projectdetails',(req, res)=>{
//     res.render('projectdetails')
// })

const db_name = path.join(__dirname, "database","database.db")
const db = new sqlite3.Database(db_name, err => {
    if(err) {
        return console.log(err.message)
    }
    console.log("FSD Database Connected")
})

const dbprojects = `CREATE TABLE IF NOT EXISTS dbprojects(
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    pname VARCHAR(30) NOT NULL,
    roll VARCHAR(12) NOT NULL,
    sem VARCHAR(20) NOT NULL,
    tech VARCHAR(30) NOT NULL
);`;

db.run(dbprojects, err=>{
    if(err){
        return console.log(err.message)
    }
    console.log('Projects table created')
})

app.get('/projectdetails', (req,res)=>{
    const sql = `SELECT * FROM dbprojects ORDER by uid`;
    db.all(sql, (err, rows)=>{
        if(err){
            return console.log(err.message);
        }
        res.render('projectdetails', {model:rows});
    })
})


app.post('/form', (req,res)=>{
    const sql = `INSERT INTO dbprojects (pname, roll, sem, tech) VALUES (?, ?, ?, ?)`
    const slot = [req.body.pname, req.body.roll, req.body.sem, req.body.tech];
    db.run(sql, slot, err =>{
        if(err){
            console.log(err.message)
        }
        res.redirect('/projectdetails');
    })
})