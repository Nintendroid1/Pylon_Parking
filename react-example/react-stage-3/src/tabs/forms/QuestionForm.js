import React, { useState } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, LinearProgress } from '@material-ui/core';
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
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import DragIcon from '@material-ui/icons/Dehaze';

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
  submit: {
    marginTop: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 3
  },
  cancel: {
    marginTop: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 3
  },
  addChoice: {
    marginLeft: theme.spacing.unit * 1
  },
  addIcon: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit
  }
});

let ChoiceField = ({
  classes,
  id,
  handleDelete,
  updateChoices,
  choices,
  ...props
}) => {
  const [text, updateText] = useState(props.value);

  const handleChange = event => {
    event.preventDefault();
    let { name, value } = event.target; // name/value from input element that changed
    if (name === 'choices') {
      updateText(value);
      changeChoice(id, value);
    }
  };

  function changeChoice(id, value) {
    let tempChoices = choices.arr.map((choice, index) => {
      if (choice.id == id) {
        choice.description = value;
      }
      return choice;
    });
  }

  return (
    <>
      <TextField
        className={classes.choice}
        type="text"
        placeholder={`${id}`}
        id={id}
        name="choices"
        key={`choice ${id}`}
        onChange={handleChange}
        value={text}
        fontSize={25}
      />
      <IconButton
        size="small"
        variant="contained"
        color="secondary"
        key={`delete icon ${id}`}
        onClick={_event => handleDelete(_event, id)}
      >
        <DeleteIcon style={{ fontSize: 20 }} />
      </IconButton>
    </>
  );
};

let QuestionForm = ({
  classes,
  currentUser,
  onSubmit,
  quest,
  nextId,
  ...props
}) => {
  const [question, updateQuestion] = useState(
    quest !== undefined
      ? {
          question: quest.question,
          description: quest.description,
          type: quest.type,
          choices: quest.choices,
          id: quest.id
        }
      : {
          question: '',
          description: '',
          type: '',
          choices: [],
          id: ''
        }
  );
  const [text, updateText] = useState('');
  const [choices, updateChoices] = useState({
    arr: quest !== undefined ? quest.choices : []
  });
  const [nextChoiceId, incrementChoiceId] = useState(
    quest !== undefined ? nextId : 1
  );

  const handleChange = event => {
    let { name, value } = event.target; // name/value from input element that changed
    updateText(value);
    updateQuestion({ ...question, [name]: value }); // update corresponding field in values object
  };

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(question);
  };

  function addChoice(event) {
    let tempChoices = choices.arr;
    tempChoices.push({ id: nextChoiceId, description: '' });
    incrementChoiceId(nextChoiceId + 1);
    //console.log(tempChoices);
    updateQuestion({ ...question, choices: tempChoices });
    updateChoices({ arr: tempChoices });
  }

  function deleteChoice(event, value) {
    let tempChoices = choices.arr.filter((choice, index) => {
      if (choice.id !== value) {
        //choice.props.id = index;
        return choice;
      }
      //return choice;
    });
    updateQuestion({ ...question, choices: tempChoices });
    updateChoices({ arr: tempChoices });
  }

  const DragHandle = sortableHandle(() => <DragIcon color="primary" />);

  const SortableItem = sortableElement(({ value, className }) => (
    <li className={className}>
      <DragHandle style={{ marginTop: 5 }} />
      {value}
    </li>
  ));

  const SortableContainer = sortableContainer(({ children, className }) => {
    return <ul className={className}>{children}</ul>;
  });

  let onSortEnd = ({ oldIndex, newIndex }) => {
    /*this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));*/
    let tempChoices = arrayMove(choices.arr, oldIndex, newIndex);
    updateChoices({ arr: tempChoices });
    updateQuestion({ ...question, choices: tempChoices });
  };

  let onSortStart = ({ oldIndex, newIndex }) => {
    console.log('DOGS');
  };

  return (
    <>
      <form
        id="newquestion"
        onSubmit={handleSubmit}
        key={'questform'}
        style={{ width: '100%' }}
      >
        <TextField
          align="center"
          className={classes.question}
          type="text"
          label="Question"
          id={'quest-field'}
          name="question"
          fullWidth
          key={'quest'}
          multiline
          onChange={handleChange}
          value={question.question}
          fontSize={25}
        />
        <TextField
          className={classes.description}
          type="text"
          label="Description"
          id={'description'}
          key={'desc'}
          name="description"
          fullWidth
          multiline
          onChange={handleChange}
          value={question.description}
          fontSize={25}
        />
        <SortableContainer
          useDragHandle
          className={classes.sortContainer}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          key={'sort container'}
        >
          {choices.arr.map((choice, index) => (
            <SortableItem
              className={classes.sortContainer}
              key={`item-${index}`}
              index={index}
              value={
                <ChoiceField
                  classes={classes}
                  value={choice.description}
                  id={choice.id}
                  key={choice.id}
                  handleDelete={deleteChoice}
                  choices={choices}
                  updateChoices={updateChoices}
                />
              }
            />
          ))}
        </SortableContainer>
        <Grid container spacing={0}>
          <Grid item>
            <Button onClick={addChoice} className={classes.addChoice}>
              <AddIcon color="primary" className={classes.addIcon} />
              <TextField
                type="text"
                name="add-choice"
                label={
                  <span style={{ fontStyle: 'italic', marginLeft: 6 }}>
                    Add New Choice
                  </span>
                }
                id={'choice-add'}
                key={'choice add'}
                fullWidth
                disabled
                fontSize={25}
              />
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={20} justify="center">
          <Grid item className={classes.submit}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid>
          <Grid item className={classes.cancel}>
            <Button
              type="reset"
              size="large"
              variant="contained"
              color="#9e9e9e"
              onClick={() => {
                props.history.goBack();
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
export default withTheme()(withStyles(styles)(QuestionForm));
