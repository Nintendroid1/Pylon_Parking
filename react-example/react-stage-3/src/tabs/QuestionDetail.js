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
import BarGraph from '../ui/BarGraph';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarWrapper from '../ui/SnackbarWrapper';
import apiprefix from './apiprefix';

const styles = theme => ({
  table: {
    width: '40%',
    margin: 'auto'
  },
  editButton: {
    marginTop: theme.spacing.unit * 5
  },
  editIcon: {
    marginLeft: theme.spacing.unit * 2
  },
  choices: {
    align: 'left'
  },
  group: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    align: 'left'
  },
  table: {
    align: 'left'
  },
  formLabel: {
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 1
  },
  formButtons: {
    padding: theme.spacing.unit * 1
  },
  questionTitle: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  votePrompt: {
    align: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
    color: theme.palette.error.main
  },
  votePromptBody: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
    color: theme.palette.common.black
  }
});

let QuestionDetail = ({ classes, currentUser, ...props }) => {
  //console.log(props);
  const [question, updateQuestion] = useState({
    question: '',
    description: '',
    type: '',
    choices: [],
    id: ''
  });
  const [hasCalled, updateCall] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingVote, setLoadingVote] = useState(false);
  const [currentChoice, setChoice] = useState(undefined);
  const [votes, updateVotes] = useState({ totals: [] });
  const [prevVote, updateVote] = useState(undefined);
  const [isVoting, setVoting] = useState(false);
  const [showSnackbar, updateSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  function selectOption(event) {
    setChoice(Number(event.target.value));
  }

  async function handleVote() {
    if (currentChoice === prevVote && prevVote !== undefined) {
      /*alert(
        'ERR: Duplicate vote!\nPlease change your vote to update the server.'
      );*/
      setSnackbarMessage(
        <SnackbarWrapper
          onClose={() => {
            updateSnackbar(false);
          }}
          variant="error"
          message="Duplicate vote! Please change your vote to update the server."
        />
      );
      updateSnackbar(true);
    }
    else if (currentChoice === undefined) {
      alert('Please Select on of the Options!');
    } else {
      await submitVote();
      setSnackbarMessage(
        <SnackbarWrapper
          onClose={() => {
            updateSnackbar(false);
          }}
          variant="success"
          message="Succesfully Voted!"
        />
      );
    }
    loadVotes();
  }

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
      console.log(rbody);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // GET   /api/question/:qid/vote
  let loadVotes = async () => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    const url = `${apiprefix}/question/${id}/vote`;
    setLoadingVote(true);
    let response = await makeAPICall('GET', url);
    let rbody = await response.json();
    if (response.status === 200) {
      console.log('Votes');
      console.log(rbody);
      updateVotes({
        totals: rbody.totals
      });
    }
    setLoadingVote(false);
  };

  // GET   /api/question/:qid/vote?user={id}
  let getUserVote = async () => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    const url = `${apiprefix}/question/${id}/vote?user=${localStorage.olivia_id}`;
    console.log(url);
    setLoadingVote(true);
    let response = await makeAPICall('GET', url);
    let rbody = await response.json();
    if (response.status === 200) {
      console.log('My Vote');
      console.log(rbody);
      updateVote(rbody.votes === undefined ? rbody.votes : rbody.votes[0]);
      setChoice(rbody.votes === undefined ? rbody.votes : rbody.votes[0]);
      setLoadingVote(false);
    } else {
      setLoadingVote(false);
    }
  };

  //POST  /api/question/:qid/vote
  let submitVote = async () => {
    var murl = window.location.pathname;
    var id = Number(murl.substring(murl.lastIndexOf('/') + 1));
    const url = `${apiprefix}/question/${id}/vote`;
    let request = { user: currentUser.id, choice: Number(currentChoice) };
    console.log(request);
    setVoting(true);
    let response = await makeAPICall('POST', url, request);
    let rbody = await response.json();
    //let response = {status: 503};
    if (response.status === 200) {
      console.log(rbody);
      updateVote(Number(currentChoice));
      updateSnackbar(true);
      setVoting(false);
    } else {
      setVoting(false);
    }
  };

  function choiceFromId(value) {
    //console.log(question);
    const tempChoice = question.choices.find((choice, index) => {
      return choice.id === value;
    });
    return tempChoice !== undefined ? tempChoice.description : '';
  }

  let ChoiceSelection = ({ choices }) => {
    return (
      <>
        <FormControl component="fieldset" className={classes.choices}>
          <FormLabel className={classes.formLabel} component="legend">
            Please chose one
          </FormLabel>
          <RadioGroup
            aria-label="Question-choices"
            name="choices"
            className={classes.group}
            value={currentChoice}
            onChange={selectOption}
          >
            {choices.map((choice, index) => {
              return (
                <FormControlLabel
                  value={choice.id}
                  control={<Radio />}
                  label={choice.description}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </>
    );
  };

  let grData = [];
  question.choices.map((choice, index) => {
    console.log(choice);
    grData.push({ color: index, x: choice.description, y: 0 });
  });
  votes.totals.forEach((vote, index) => {
    let dataInd = grData.find((elem, index) => 
      (elem.x === choiceFromId(vote.choice))
      //  console.log("FEEND ",elem);
    );
    //console.log("DATA",dataInd);
    if (dataInd !== undefined) {
      grData[dataInd.color] = { ...grData[dataInd.color], y: vote.count };
    }
  });

  let labels = [];
  votes.totals.map(choice => labels.push(choiceFromId(choice.choice)));
  console.log(grData);
  console.log(labels);
  let votingResults = (
    <Grid item xs={6}>
      <Card>
        <>
          <BarGraph data={grData} axisLabel={labels} />
        </>
      </Card>
    </Grid>
  );

  let votingPrompt = (
    <Grid item xs={6}>
      <Card>
        <Typography align="center" className={classes.votePrompt} variant="h5">
          No Votes Found!
        </Typography>
        <Typography
          align="center"
          className={classes.votePromptBody}
          variant="h6"
        >
          You must vote first before you can see the results!
        </Typography>
      </Card>
    </Grid>
  );

  if (!hasCalled) {
    updateCall(true);
    getUserVote();
    loadQuestion();
    loadVotes();
  }
  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={6}>
          <Card>
            <div style={{ width: '100%' }}>
              <Typography
                align="center"
                variant="h5"
                className={classes.questionTitle}
                gutterBottom
              >
                {question.question}
              </Typography>
              <Table className={classes.table}>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">
                      {isLoading ? (
                        <LinearProgress />
                      ) : (
                        <ChoiceSelection choices={question.choices} />
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <CardActions className={classes.formButtons}>
                <Grid container spacing={8}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      size="medium"
                      color="primary"
                      onClick={handleVote}
                    >
                      <b>VOTE</b>
                    </Button>
                  </Grid>
                  <Grid
                    item
                    style={{ marginLeft: props.theme.spacing.unit * 2 }}
                  >
                    <Button
                      variant="outlined"
                      size="medium"
                      color="#9e9e9e"
                      component={Link}
                      to={{
                        pathname: '/questions',
                        state: {
                          from: props.history.location.pathname
                        }
                      }}
                    >
                      <b>CANCEL</b>
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </div>
          </Card>
        </Grid>
        {prevVote === undefined ? votingPrompt : votingResults}
      </Grid>
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
      </Snackbar>
    </>
  );
};
export default withTheme()(
  withStyles(styles)(RequireAuthentication(QuestionDetail))
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
