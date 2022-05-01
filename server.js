const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  PORT = 5000,
  SESSION_LIFETIME = TWO_HOURS,
  NODE_ENV = "development",
  SESS_NAME = "sid",
  SESS_SECRET = "SDFNALBGOEOINLN",
} = process.env;

const IN_PROD = NODE_ENV === "production";

const users = [
  { id: 1, name: "mohammed", email: "moha@gmail.com", password: "thepass" },
  { id: 2, name: "hamada", email: "hamada@gmail.com", password: "thepass" },
];

const app = express();

app.use(bodyParser.urlencoded({
    extended: true,
}))

app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESSION_LIFETIME,
      sameSite: true,
      secure: IN_PROD,
    },
  })
);

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next(); 
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/home')
    } else {
        next(); 
    }
}

app.get("/", (req, res) => {
  const { userId } = req.session;
  console.log(req.session);
  res.send(`
    <h1>welcome!</h1>
    ${
      userId
        ? `
    <a href='/home'>Home</a>
    <form method='post' action='/logout'>
    <button>Logout</button>
    </form>
    `
        : `
    <a href='/login'>login</a>
    <a href='/register'>register</a>
    `
    }
    `);
});

app.get("/home", redirectLogin,  (req, res) => {
  res.send(`
  <h1>Home</h1>
  <a href='/'>Main</a>
  <ul>
  <li>Name: </li>
  <li>Email: </li>
  </ul>
  `)
});

app.get("/login",redirectHome, (req, res) => {
  res.send(`
  <h1>Login</h1>
  <form method='post' action='/login'>
  <input type='email' name='email' placeholder='email' required />
  <input type='password' name='password' placeholder='password' required />
  <input type='submit' />
  </form>
  <a href='/register'>Register</a>
  `)
});

app.get("/register",redirectHome, (req, res) => {
    res.send(`
  <h1>Register</h1>
  <form method='post' action='/register'>
  <input name='name' placeholder='name' required />
  <input type='email' name='email' placeholder='email' required />
  <input type='password' name='password' placeholder='password' required />
  <input type='submit' />
  </form>
  <a href='/login'>login</a>
  `)
});

app.post("/login",redirectHome,  (req, res) => {
    const { email, password } = req.body 

    if ( email && password ) {
        const user = users.find(
            user => user.email === email && user.password === password //hash password
        )
        if (user) {
            req.session.userId = user.id
            return res.redirect('/home')
        }
    }
    res.redirect('/login')

});

app.post("/register",redirectHome, (req, res) => {
    const { name, email, password } = req.body

    if (name && email && password ) { //! todo validation
        const exists = users.some(
            user => user.email === email
        )
        if (!exists) {
            const user = {
                id: users.length + 1,
                name, 
                email,
                password, //hashed
            }
            users.push(user)

            req.session.userId = user.id
            return res.redirect('/home')
        }
    }

    res.redirect('/register') //? register/?error=error.auth.userExists or other error types.
});

app.post("/logout",redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home')
        }


        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
});

app.listen(PORT, () => console.log(`Runnin on PORT: ${PORT}`));
