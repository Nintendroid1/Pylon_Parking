/**
 * Most of your work will be here.
 */
const express = require('express');
const {
  insertNewQuestion /* { question, description, choices, type } */,
  getQuestion /* questionid */,
  deleteQuestion /* questionid */,
  updateQuestion /* questionid, { question, descr, choices, type } */,
  voteForQuestion /* userid, questionid, answerchoiceid, deleteoldvote = true */,
  getUserVotesForQuestion /* userid, questionid */,
  getVotesForQuestion /* questionid */,
  listQuestions /* firstPage, pgSize = Default */,
  countQuestions
} = require('../db/queries');
const { requireLogin, requireAdmin } = require('./auth');

const questionapirouter = express.Router();

/*questionapirouter.delete('/', requireAdmin, async function(req, res) {
  try {
    let dbwriter = await userdb;
    dbwriter.clear();
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json(err);
  }
});
*/
questionapirouter.delete('/:question_id', requireAdmin, async function(
  req,
  res
) {
  try {
    let qid = Number(req.params.question_id);
    let question = await getQuestion(qid);
    if (question !== false) {
      await deleteQuestion(qid);
      res.json({ message: 'Question deleted' });
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

/**
 * Handles request to create a new question
 */
questionapirouter.post('/', requireAdmin, async function(req, res) {
  let id = await insertNewQuestion(req.body);
  res.json({ id: id, message: 'Question inserted' });
});

questionapirouter.get('/:question_id', requireLogin, async function(req, res) {
  try {
    let question = await getQuestion(Number(req.params.question_id));
    if (question !== undefined) {
      let tempChoices = question.choices;
      let choices = [];
      tempChoices.forEach(choice => {
        let tempChoice = {
          description: choice.description,
          id: choice.id
        };
        choices.push(tempChoice);
      });
      res.json({
        description: question.description,
        id: question.id,
        question: question.question,
        type: question.type,
        choices: choices
      });
      res.sendStatus(200);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (err) {
    res.status(400);
  }
});

questionapirouter.get('/', requireLogin, async function(req, res) {
  try {
    let pageNum = req.query.page !== undefined ? Number(req.query.page) : 0;
    let questions = await listQuestions(pageNum, 10);
    let questNum = await countQuestions();
    questNum = questNum[0]['COUNT(*)'];
    let questArr = [];
    //console.log(users);
    //console.log(userNum);
    //console.log(questions);

    questions.forEach(question => {
      questArr.push({
        id: question.id,
        question: question.question,
        description: question.description,
        type: question.type
      });
    });

    let hasMoreQuestions = (pageNum + 1) * 10 < questNum;

    res.json({ questions: questArr, has_more: hasMoreQuestions });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

questionapirouter.put('/:question_id', requireAdmin, async function(req, res) {
  try {
    let newQuestion = req.body;
    await updateQuestion(req.params.question_id, newQuestion);
    res.json({ newQuestion });
  } catch (err) {
    console.log(err);
  }
});

questionapirouter.post('/:question_id/vote', requireLogin, async function(
  req,
  res
) {
  try {
    await voteForQuestion(req.user.id, req.params.question_id, req.body.choice);
    res.json({ message: 'Vote cast' });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

questionapirouter.get('/:question_id/vote', requireLogin, async function(
  req,
  res
) {
  try {
    if (req.query.user === undefined) {
      if (req.user === undefined) {
        res.status(401).json({ message: 'Must be logged in' });
      } else {
        let voteResults = await getVotesForQuestion(req.params.question_id);
        res.json({ totals: voteResults });
      }
    } else if (
      Number(req.user.id) === Number(req.query.user) ||
      req.user.admin === 1
    ) {
      let result = await getUserVotesForQuestion(
        req.query.user,
        req.params.question_id
      );
      res.json({ votes: result });
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});
module.exports = questionapirouter;
