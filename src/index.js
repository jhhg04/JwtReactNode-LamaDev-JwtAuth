const express = require('express');
const app = express();
const port = 5000;
const jwt = require('jsonwebtoken');

app.use(express.json());
app.set('port', process.env.PORT || port);

const users = [
  {
    id: '1',
    username: 'john',
    password: 'asdf1234',
    isAdmin: true,
  },
  {
    id: '2',
    username: 'harold',
    password: 'asdf1234',
    isAdmin: false,
  },
];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // res.json('It Works!');
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  if (user) {
    // res.json(user);
    /* Generate an access token */
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      'mySecretKey'
    );
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } else {
    res.status(400).json('Username or Password Incorrect!');
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'mySecretKey', (err, user) => {
      if (err) {
        return res.status(401).json('Token is not valid!');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json('You are not authenticated!');
  }
};

app.delete('/api/users/:userId', verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json('User has been deleted');
  } else {
    res.status(403).json('You are not allowed to delete this user!');
  }
});

app.listen(app.get('port'), () => {
  console.log('SERVER is Running on port: ', app.get('port'));
});
