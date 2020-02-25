/**
 * Most of your work will be here.
 */
const bcrypt = require('bcrypt');
const {
  addUser /* { ... user } */,
  getUserById /* id */,
  getUserByName /* name */,
  listUsers /* firstPage, pgSize */,
  updateUser /* id, { ...user } */,
  deleteUser,
  deleteAllUsers,
  countUsers
} = require('../db/queries');
const express = require('express');
const { requireLogin, requireAdmin, token } = require('./auth');

const userapirouter = express.Router();

userapirouter.delete('/', requireAdmin, async function(req, res) {
  try {
    await deleteAllUsers();
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json(err);
  }
});

userapirouter.delete('/:user_id', requireLogin, async function(req, res) {
  try {
    let result = await getUserById(Number(req.params.user_id));
    let user = result[0];
    if (user !== undefined) {
      await deleteUser(Number(req.params.user_id));
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

/**
 * Handle requests to create user and login
 */
userapirouter.post('/', async function(req, res) {
  let user = req.body;
  try {
    // Handle the create request
    let fieldSize = Object.keys(user).length;
    if (
      fieldSize == 5 &&
      'username' in user &&
      'password' in user &&
      'firstname' in user &&
      'lastname' in user &&
      'email' in user
    ) {
      if (
        user.password == '' ||
        user.username == '' ||
        user.firstname == '' ||
        user.lastname == '' ||
        user.email == ''
      ) {
        res.status(401).json({ message: 'Insufficient Request' });
      } else {
        let tempUser = await getUserByName(user.username);
        tempUser = tempUser[0];
        if (tempUser !== undefined) {
          res.status(409).json({ message: 'User Already Exists' });
        } else {
          user.password = await bcrypt.hash(user.password, 8);
          user.admin = user.username === 'admin' ? true : false;
          let u_id = await addUser(user);
          let isAdmin = false;
          if (user.username === 'admin') {
            isAdmin = true;
          }

          let cur_user = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            admin: isAdmin,
            id: u_id
          };
          let userToken = token(cur_user);
          res.json({
            token: userToken,
            user: cur_user,
            message: 'New User Created!'
          });
        }
      }
    }
    // Handle the login request
    /*     else if ('username' in req.body && 'password' in req.body) {
      if (req.body.password == '' || req.body.username == '') {
        //console.log(req.body);
        res.status(400).json({ message: 'Bad request' });
      } else {
        auth.loginRequestHandler(req, res);
      }*/
    else {
      //console.log(req.body);
      res.status(400).json({ message: 'Insufficient Request' });
    }
  } catch (err) {
    console.log(err);
  }
});

userapirouter.get('/:user_id', requireLogin, async function(req, res) {
  try {
    let result = await getUserById(Number(req.params.user_id));
    let user = result[0];
    if (user !== undefined) {
      res.json({
        username: user.username,
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      });
      res.sendStatus(200);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400);
  }
});

userapirouter.get('/', requireAdmin, async function(req, res) {
  try {
    let pageNum = req.query.page !== undefined ? Number(req.query.page) : 0;
    let users = await listUsers(pageNum, 10);
    let userNum = await countUsers();
    userNum = userNum[0]['COUNT(*)'];
    let userArr = [];
    //console.log(users);
    //console.log(userNum);

    users.forEach(user => {
      userArr.push({
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        admin: user.admin
      });
    });

    let hasMoreUsers = (pageNum + 1) * 10 < userNum;

    res.json({ users: userArr, has_more: hasMoreUsers });
  } catch (err) {
    res.status(400);
  }
});

userapirouter.put('/:user_id', requireLogin, async function(req, res) {
  try {
    if (Number(req.params.user_id) === req.user.id || req.user.admin === 1) {
      let newUser = req.body;
      if ('password' in newUser) {
        newUser.password = await bcrypt.hash(newUser.password, 8);
      }
      await updateUser(req.params.user_id, newUser);
      let userToken = token(newUser);
      res.json({ token: userToken, user: newUser, message: 'User updated' });
    } else {
      res.status(403).json({ message: 'Bad request' });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = userapirouter;
