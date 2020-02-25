import React, { useState } from 'react';
import { makeAPICall } from '../api';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Check from '@material-ui/icons/Check';
import { Typography, CircularProgress } from '@material-ui/core';
import RequireAuthentication from '../RequireAuthentication';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import QuestionDetail from './QuestionDetail';
import { Route } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import WhereToVoteIcon from '@material-ui/icons/WhereToVote';
import { Link } from 'react-router-dom';
import NavigateLeftIcon from '@material-ui/icons/NavigateBefore';
import NavigateRightIcon from '@material-ui/icons/NavigateNext';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import { dialog, Confirm } from '../ui/ConfirmDialog';
import apiprefix from './apiprefix';

const styles = theme => ({
  table: {
    width: '90%',
    margin: 'auto'
  },
  optionsCell: {
    marginRight: theme.spacing.unit * 4
  },
  questionCell: {
    marginRight: theme.spacing.unit * 6
  },
  fab: {
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 4,
    top: 'auto',
    left: 'auto',
    position: 'fixed'
  }
});

function createQuestionEntry(question) {
  return {
    id: question.id,
    question: question.question,
    description: question.description,
    type: question.type
  };
}
const SurveyTab = ({ classes, match, location, history, ...props }) => {
  console.log(history);
  function findCurrentPageBasedOnPath(location) {
    let tempQuery = queryString.parse(location.search);
    return isNaN(Number(tempQuery.page)) ? 0 : Number(tempQuery.page);
  }
  const [haveCalled, updateCall] = useState(false);
  const [message, updateMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [questions, updateQuestionList] = useState(null);
  const [pageNum, setPage] = useState(findCurrentPageBasedOnPath(location));
  const [lastRenderedPage, setLastRendered] = useState(-1);

  let hasMoreQuestions = false;
  console.log(props);
  console.log(match);
  let query = queryString.parse(location.search);
  if (isNaN(Number(query.page))) {
    query = { page: '0' };
  }

  async function prevPage() {
    if (Number(query.page) > 0) {
      query.page--;
      setPage(query.page);
      let tempLocation = {
        pathname: `/questions`,
        search: `?page=${Number(query.page)}`,
        state: {
          from: history.location
        }
      };
      history.push(tempLocation);
      //history.goForward();
      await listQuestions();
    }
  }
  async function nextPage() {
    query.page++;
    setPage(query.page);
    let tempLocation = {
      pathname: `/questions`,
      search: `?page=${Number(query.page)}`,
      state: {
        from: history.location
      }
    };
    history.push(tempLocation);
    //history.goForward();
    await listQuestions();
  }

  function addQuestion() {
    history.push({
      pathname: `/questions/new`,
      state: {
        from: history.location
      }
    });
  }

  function editQuestion(value) {
    history.push({
      pathname: `/question/edit/${value}`,
      state: {
        from: history.location
      }
    });
  }

  let confirmDelete = async id => {
    let shouldDelete = await dialog(
      <Confirm title="Are you sure?">
        <Typography variant="body2">
          Are you sure you want to delete this question?
        </Typography>
      </Confirm>
    );
    if (shouldDelete) {
      handleDelete(id);
      updateCall(false);
    }
  };
  async function handleDelete(id) {
    setLoading(true);
    const url = `${apiprefix}/question/${id}`;
    let response = await makeAPICall('DELETE', url);
    let rbody = await response.json();
    //let response = {status: 503};
    console.log(rbody);
    if (response.status === 200) {
    }
    setLoading(false);
  }

  let buildTable = questions => {
    let questList = [];
    questions.map(question => questList.push(createQuestionEntry(question)));

    return (
      <>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="center">
                <span>Question</span>
              </TableCell>
              <TableCell align="right" className={classes.optionsCell}>
                <span className={classes.optionsCell}>Options</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Link
                    to={{
                      pathname: `/question/${row.id}`,
                      state: {
                        from: history.location
                      }
                    }}
                  >
                    <IconButton
                      size="medium"
                      variant="contained"
                      color="primary"
                    >
                      <WhereToVoteIcon color="primary" />
                    </IconButton>
                  </Link>
                </TableCell>
                <TableCell width={props.theme.spacing.unit * 80}>
                  <Typography variant="h6" align={'left'} marginRight={50}>
                    {row.question}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: 14,
                      marginTop: props.theme.spacing.unit,
                      textAlign: 'left'
                    }}
                  >
                    {'Please choose one.'}
                  </Typography>
                </TableCell>

                {Number(localStorage.olivia_id) === 1 ? (
                  <TableCell align="right">
                    <IconButton
                      size="medium"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        editQuestion(row.id);
                      }}
                    >
                      <EditIcon style={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton
                      size="medium"
                      variant="contained"
                      color="primary"
                      onClick={() => confirmDelete(row.id)}
                    >
                      <DeleteIcon style={{ fontSize: 20 }} />
                    </IconButton>
                  </TableCell>
                ) : (
                  <TableCell />
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container spacing={20} justify="center">
          <Grid item className={classes.navButton}>
            <IconButton
              //Previous Button
              disabled={query.page < 1}
              size="large"
              variant="contained"
              color="primary"
              onClick={prevPage}
            >
              <NavigateLeftIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Grid>

          <Grid item className={classes.navButton}>
            <IconButton
              //Next Button
              disabled={!hasMoreQuestions}
              size="large"
              variant="contained"
              color="primary"
              onClick={nextPage}
            >
              <NavigateRightIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Grid>
        </Grid>
        {Number(localStorage.olivia_id) === 1 ? (
          <Fab className={classes.fab} color="primary" onClick={addQuestion}>
            {' '}
            <AddIcon />{' '}
          </Fab>
        ) : null}
      </>
    );
  };

  let listQuestions = async () => {
    //    showSpinner(true);
    const url = `${apiprefix}/question/?page=${query.page}`;
    setLastRendered(Number(query.page));
    setLoading(true);
    let response = await makeAPICall('GET', url);
    let rbody = await response.json();
    setLoading(false);
    if (response.status === 200) {
      console.log('Got Questions');
      console.log(rbody);
      let { questions } = rbody;
      hasMoreQuestions = rbody.has_more;
      updateQuestionList(buildTable(questions));
    } else if (response.status === 403) {
      updateMessage(
        <div key="fail" style={{ color: '#fc3c3c' }}>
          Requires admin permission
        </div>
      );
    } else {
      setLoading(false);
    }
    // all API responses have JSON bodie
    //    showSpinner(false);
  };

  // This is to ensure listUsers() is only called once when the page loads
  if (!haveCalled) {
    updateCall(true);
    listQuestions();
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <Typography align="center" variant="h5" gutterBottom>
          Available Questions
        </Typography>
        <Typography>
          {isLoading ? (
            <div style={{ paddingTop: '50px' }} align="center">
              <CircularProgress />
            </div>
          ) : (
            questions
          )}
          {message ? (
            <div
              style={{ paddingTop: '50px', fontSize: '18px' }}
              align="center"
            >
              {message}
            </div>
          ) : null}
        </Typography>
      </div>
    </>
  );
};

SurveyTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme()(
  withStyles(styles)(RequireAuthentication(SurveyTab))
);
