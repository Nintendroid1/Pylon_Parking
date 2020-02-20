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
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import QuestionForm from './forms/QuestionForm';
import apiprefix from './apiprefix';

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
  choice: {
    margin: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  title: {
    marginTop: theme.spacing.unit * 2
  },
  error: {
    color: theme.palette.error.main
  }
});

let NewQuestion = ({ classes, currentUser, quest, ...props }) => {
  const [question, updateQuestion] = useState(
    quest !== undefined
      ? quest
      : {
          question: '',
          description: '',
          type: '1',
          choices: [],
          id: ''
        }
  );
  const [hasCalled, updateCall] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingVote, setLoadingVote] = useState(false);
  const [currentChoice, setChoice] = useState(undefined);
  const [votes, updateVotes] = useState({ totals: [] });
  const [prevVote, updateVote] = useState(undefined);
  const [isVoting, setVoting] = useState(false);
  const [text, updateText] = useState('');
  const [choices, updateChoices] = useState({ arr: [] });

  let postQuestion = async values => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    const url = `${apiprefix}/question/`;
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
    values.type = '1';
    console.log(values);
    let response = await makeAPICall('POST', url, values);
    let rbody = await response.json();
    //let response = {status: 503};
    console.log(rbody);
    if (response.status === 200) {
      props.history.replace({
        pathname: '/questions',
        state: {
          from: `/question/edit/${rbody.id}`
        }
      });
    }
    //alert(rbody.message);
  };

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

  return (
    <>
      {currentUser.admin ? (
        <main className={classes.main}>
          <Card>
            <Typography align="center" variant="h5" className={classes.title}>
              Create New Question
            </Typography>
            <QuestionForm
              history={props.history}
              onSubmit={question => handleSubmit(question)}
            />
          </Card>
        </main>
      ) : (
        <Typography align="center" variant="h5" className={classes.error}>
          Requires Admin Permission
        </Typography>
      )}
    </>
  );
};
export default withTheme()(
  withStyles(styles)(RequireAuthentication(NewQuestion))
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
