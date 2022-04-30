const express = require('express');
const session = require('express-session'); 

const TWO_HOURS = 1000 * 60 * 60 * 2;

const { PORT = 5000,
        SESSION_LIFETIME = TWO_HOURS,
        NODE_ENV = 'development',
        SESS_NAME = 'sid',
        SESS_SECRET = 'SDFNALBGOEOINLN'
} = process.env

const IN_PROD = NODE_ENV === 'production';

const users = [
    {id: 1, name: 'mohammed', email:'moha@gmail.com', password: 'thepass'},
    {id: 2, name: 'hamada', email:'hamada@gmail.com', password: 'thepass'}
]

const app = express(); 

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESSION_LIFETIME, 
        sameSite: true, 
        secure: IN_PROD,
    }
}));

app.get('/', (req, res) => {
    const { userId } = req.session
    console.log(req.session);
    res.send(`
    <h1>welcome!</h1>
    ${userId ? `
    <a href='/home'>Home</a>
    <form method='post' action='/logout'>
    <button>Logout</button>
    </form>
    ` : `
    <a href='/login'>login</a>
    <a href='/register'>register</a>
    `}
    `)
})

app.get('/home', (req, res) => {

})

app.get('/login', (req, res) => {
    //req.session.userId = 

})

app.get('/register', (req, res) => {

})

app.post('/login', (req, res) => {

})

app.post('/register', (req, res) => {

})

app.post('/logout', (req, res) => {

})

app.listen(PORT, () => console.log(`Runnin on PORT: ${PORT}`));