// This file contains your database layer
//
//@ts-check
const dbPool = require('./pool');
const fs = require('fs');
var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("subscribe", function (channel, count) {
    pub.publish("a nice channel", "I am sending a second message.");
    pub.publish("a nice channel", "I am sending my last message.");
});

async function rebuildDatabase() {
  const createDbScript = `${__dirname}/createdb.sql`;

  const sql = fs.readFileSync(createDbScript, 'utf8');
  return dbPool.query(sql);
}

async function deleteAllUsers() {
  return dbPool.query(`DELETE * FROM users`);
}

async function deleteUser(userid) {
  return dbPool.query(`DELETE FROM users WHERE id=?`, userid);
}

async function getUserById(userid) {
  return dbPool.query(`SELECT * FROM users WHERE id=?`, userid);
}

async function getUserByName(username) {
  return dbPool.query(`SELECT * FROM users WHERE username=?`, username);
}

async function setAdminState(userid, isAdmin) {
  return dbPool.query(`UPDATE users SET admin=? WHERE id=?`, [isAdmin, userid]);
}

async function addUser(user) {
  let result = await dbPool.query(`INSERT INTO users SET ?`, user);
   client.publish("socket.io#/auth#", "User Added");
  return result.insertId;
}

async function listUsers(pageNum, numUsers) {
  return dbPool.query(
    `SELECT id, username, email, lastname, firstname, admin FROM users LIMIT ? OFFSET ?`,
    [numUsers, pageNum * numUsers]
  );
}

async function countUsers() {
  return dbPool.query(`SELECT COUNT(*) FROM users`);
}

async function countQuestions() {
  return dbPool.query(`SELECT COUNT(*) FROM question`);
}

async function updateUser(id, user) {
  return dbPool.query(`UPDATE users SET ? WHERE id = ?`, [user, id]);
}

async function insertNewQuestion(question) {
  let result = await dbPool.query(
    `INSERT INTO question SET question=?, description=?, type=?`,
    [question.question, question.description, question.type]
  );
  let inputs = [];
  question.choices.forEach((element, index) => {
    inputs.push([result.insertId, element, index]);
  });

  dbPool.query(
    `INSERT INTO answerchoice (questionid, description, position) VALUES ?`,
    [inputs]
  );
  return result.insertId;
}

async function listQuestions(pageNum, pgSize = 10) {
  return dbPool.query(`SELECT * FROM question LIMIT ? OFFSET ?`, [
    pgSize,
    pageNum * pgSize
  ]);
}

async function getQuestion(questionid) {
  let quest = dbPool.query(`SELECT * FROM question WHERE id=?`, questionid);
  //return quest;
  let choices = dbPool.query(
    `SELECT * FROM answerchoice  WHERE questionid=?`,
    questionid
  );
  let promises = [quest, choices];
  return await Promise.all(promises).then(result => {
    //console.log(result);

    if (result[0].length === 0) {
      return false;
    }
    let response = result[0][0];
     response.choices = result[1];
     console.log(response.choices);

    return response;
  });
}

async function deleteQuestion(questionid) {
  return dbPool.query(`DELETE FROM question WHERE id=?`, questionid);
}

async function updateQuestion(questionid, question) {
  let updatedQuestion = {
    question: question.question,
    description: question.description,
    type: question.type
  };

  let result = await dbPool.query(`UPDATE question SET ? WHERE id=?`, [
    updatedQuestion,
    questionid
  ]);

  await dbPool.query(`DELETE FROM vote WHERE questionid=?`, questionid);
  await dbPool.query(`DELETE FROM answerchoice WHERE questionid=?`, questionid);

  let inputs = [];
   question.choices.forEach((answerChoices, index) => {
   console.log(answerChoices);
    inputs.push([questionid, answerChoices, index]);
   });
   console.log(inputs);

  await dbPool.query(
    `INSERT INTO answerchoice (questionid, description, position) VALUES ?`,
    [inputs]
  );
  return result.changedRows;
}

async function voteForQuestion(
  userid,
  questionid,
  answerchoiceid,
  deleteoldvote = true
) {
  if (deleteoldvote) {
    await dbPool.query(`DELETE FROM vote WHERE questionid=? AND userid=?`, [
      questionid,
      userid
    ]);
  }
   client.publish("socket.io#/votes#", "I am sending a message.");
  return dbPool.query(
    `INSERT INTO vote SET answerchoiceid=?, userid=?, questionid=?`,
    [answerchoiceid, userid, questionid]
  );
}

async function getUserVotesForQuestion(userid, questionid) {
  let result = await dbPool.query(
    `SELECT * FROM vote WHERE questionid=? AND userid=?`,
    [questionid, userid]
  );
  return result.length > 0 ? [result[0].answerchoiceid] : undefined;
}

async function getVotesForQuestion(questionid) {
  let result = await dbPool.query(
    `SELECT COUNT(*), answerchoiceid FROM vote WHERE questionid=? GROUP BY answerchoiceid`,
    [questionid]
  );
  let votingResults = [];
   result.forEach((quest, index) => {
      console.log(quest);
    votingResults[index] = {
      choice: quest.answerchoiceid,
      count: quest[`COUNT(*)`]
    };
  });
   console.log(votingResults);
  return votingResults;
}

module.exports = {
  rebuildDatabase,
  addUser /* { ... user } */,
  getUserById /* id */,
  getUserByName /* name */,
  setAdminState /* userid, 0/1 */,
  listUsers /* firstPage, pgSize */,
  updateUser /* id, { ...user } */,
  insertNewQuestion /* { question, description, choices, type } */,
  listQuestions /* firstPage, pgSize = Default */,
  getQuestion /* questionid */,
  deleteQuestion /* questionid */,
  updateQuestion /* questionid, { question, descr, choices, type } */,
  voteForQuestion /* userid, questionid, answerchoiceid, deleteoldvote = true */,
  getUserVotesForQuestion /* userid, questionid */,
  getVotesForQuestion /* questionid */,
  deleteUser,
  deleteAllUsers,
  countUsers,
  countQuestions
};
