import React, { useState } from 'react';
import { makeAPICall } from '../api';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, LinearProgress } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Card from '@material-ui/core/Card';
import Snackbar from '@material-ui/core/Snackbar';
import QuestionForm from './forms/QuestionForm';
import apiprefix from './apiprefix';
import SnackbarWrapper from '../ui/SnackbarWrapper';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 700,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  title: {
    marginTop: theme.spacing.unit * 2
  },
  choice: {
    marginBottom: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 1.5,
    width: '75%'
  },
  question: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 2,
    width: '90%'
  },
  description: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 2,
    width: '90%'
  },
  sortContainer: {
    listStyleType: 'none',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    color: theme.palette.error.main
  }
});

let EditQuestion = ({ classes, currentUser, ...props }) => {
  console.log(props);
  const [question, updateQuestion] = useState({
    question: '',
    description: '',
    type: '',
    choices: [],
    id: ''
  });
  const [hasCalled, updateCall] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [text, updateText] = useState('');
  const [choices, updateChoices] = useState({ arr: [] });
  const [nextChoiceId, incrementChoiceId] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [showSnackbar, updateSnackbar] = useState(false);

  const handleSubmit = values => {
    postQuestion(values);
  };

  /**
   * ===================================
   *            Api Calls
   * -----------------------------------
   *  - GET   /api/question/:qid
   *  - GET   /api/question/:qid/vote
   *  - GET   /api/question/:qid/vote?user={id}
   *  - POST  /api/question/:qid/vote
   * ===================================
   */

  // GET   /api/question/:qid
  let loadQuestion = async () => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    const url = `${apiprefix}/question/${id}`;
    setLoading(true);
    let response = await makeAPICall('GET', url);
    let rbody = await response.json();
    if (response.status === 200) {
      updateQuestion({
        question: rbody.question,
        description: rbody.description,
        type: rbody.type,
        choices: rbody.choices,
        id: rbody.id
      });
      console.log(rbody.choices);
      let tempChoices = rbody.choices.map((choice, index) => choice);
      let maxId = -1;
      for (var i = 0; i < tempChoices.length; i++) {
        if (tempChoices[i].id > maxId) {
          maxId = tempChoices[i].id;
        }
      }
      incrementChoiceId(rbody.choices.length + 1);
      console.log(tempChoices);
      updateChoices({ arr: tempChoices });
      console.log(rbody);
      setLoading(false);
      console.log(question);
    } else {
      setLoading(false);
    }
  };

  let postQuestion = async values => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    const url = `${apiprefix}/question/${id}`;
    console.log('Sub');
    console.log(values);
    values.choices = values.choices.map(choice => {
      if (
        choice !== undefined &&
        choice.description !== undefined &&
        choice.description.length > 0
      ) {
        return choice.description;
      }
    });
    values.choices = values.choices.filter(
      choice => choice !== undefined && choice !== null && choice.length > 0
    );
    console.log(values);
    let response = await makeAPICall('PUT', url, values);
    let rbody = await response.json();
    let newQuestion = rbody.newQuestion;
    //let response = {status: 503};
    console.log('RESP: ');
    console.log(newQuestion);
    console.log(newQuestion.choices);
    if (response.status === 200) {
      updateQuestion({
        question: newQuestion.question,
        description: newQuestion.description,
        type: newQuestion.type,
        choices: newQuestion.choices,
        id: newQuestion.id
      });
      updateChoices({ arr: newQuestion.choices });
      setSnackbarMessage(
        <SnackbarWrapper
          onClose={() => {
            updateSnackbar(false);
          }}
          variant="success"
          message="Question Updated Successfully!"
        />
      );
      updateSnackbar(true);
    } else {
      setSnackbarMessage(
        <SnackbarWrapper
          onClose={() => {
            updateSnackbar(false);
          }}
          variant="error"
          message="Error Updating Question!"
        />
      );
      updateSnackbar(true);
    }
    //alert(rbody.message);
  };

  if (!hasCalled) {
    updateCall(true);
    loadQuestion();
  }

  return (
    <>
      {currentUser.admin ? (
        <>
          <main className={classes.main}>
            <Card>
              <Typography align="center" variant="h5" className={classes.title}>
                Edit Question
              </Typography>
              {isLoading ? null : (
                <QuestionForm
                  history={props.history}
                  quest={question}
                  nextId={nextChoiceId}
                  onSubmit={question => handleSubmit(question)}
                />
              )}
            </Card>
          </main>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            open={showSnackbar}
            autoHideDuration={3000}
            onClose={() => {
              updateSnackbar(false);
            }}
          >
            {snackbarMessage}
          </Snackbar>{' '}
        </>
      ) : (
        <Typography align="center" variant="h5" className={classes.error}>
          Requires Admin Permission
        </Typography>
      )}
    </>
  );
};
export default withTheme()(
  withStyles(styles)(RequireAuthentication(EditQuestion))
);

/*

 <Grid container spacing={20} justify="center">
          <Grid item className={classes.editButton}>
            <Link
              to={{
                pathname: `/profile/edit/${question.id}`,
                state: {
                  from: props.history.location
                }
              }}
              style={{textDecoration: 'none'}}
            >
              <Button size="large" variant="outlined" color="primary">
                Edit Profile<EditIcon className={classes.editIcon}/> 
              </Button>
            </Link>
          </Grid>
        </Grid>

*/
