const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const KnexSessionStore = require('connect-session-knex')(session);
const knexfile = require('./knexfile');


const db = knex(knexfile.development);
const sessionConfig = {
  name: 'Drew III',
  secret: 'dkdfajkflfajkfakjk;fldaj;fadk;fl;kl;a',
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  resave: true,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: db,
  }),
};

const server = express();
server.use(session(sessionConfig));
server.use(express.json());
const config = {
  origin: 'http://localhost:3000',
  credentials: true, // enable set cookie
};
server.use(cors(config));

server.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 12);
    const [id] = await db('users').insert({ username, password: hash });
    res.status(201).json({ id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

server.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Send all required fields' });
    }
    const { password: hash, id } = await db('users').select('password', 'id').where('username', username).first();
    if (!hash || !bcrypt.compareSync(password, hash)) {
      return res.status(403).json({ message: 'Could not authenticate.' });
    }
    req.session.userId = id;
    return res.status(200).json({ username, id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

server.post('/api/logout', async (req, res) => {
  if (req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'an error occurred' });
      }
      return res.status(200).send();
    });
  } else {
    return res.status(400).json({ message: 'User is not logged in' });
  }
});

server.get('/api/users', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send();
    }
    const users = await db('users').select('id', 'username');
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});


server.listen(8000, () => console.log('listening on 8000'));
