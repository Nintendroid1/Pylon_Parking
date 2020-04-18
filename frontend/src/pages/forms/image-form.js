import React, { useState, useEffect } from 'react';
import { makeAPICall, makeImageAPICall } from '../../api';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { CircularProgress } from '@material-ui/core';
import apiprefix from '../apiprefix';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
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
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 8
  },
  circularPreview: {
    width: '200px',
    marginTop: theme.spacing.unit * 4,
    borderTopLeftRadius: '50% 50%',
    borderTopRightRadius: '50% 50%',
    borderBottomRightRadius: '50% 50%',
    borderBottomLeftRadius: '50% 50%'
  }
});

function ImageForm({ onSubmit, message, classes, isLoading, setLoading }) {
  const [tempImage, setTempImage] = useState({
    path: '',
    file: '',
    imageData: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  // a universal onChange handler that propagates user input to component state
  const handleChange = event => {
    if (event.target.files && event.target.files[0]) {
      let { name, value, files } = event.target;
      var reader = new FileReader();
      reader.onload = function(e) {
        // The file's text will be printed here
        let imageData = e.target.result;
        setTempImage({ ...tempImage, imageData: imageData });
        setPreviewImage(
          <img
            className={classes.circularPreview}
            src={`${imageData}`}
            alt="user-profile"
          />
        );
        // var dataURL = reader.result;
        // var output = document.getElementById('output');
        // output.Src = dataURL;
      };
      reader.readAsDataURL(files[0]);
      setTempImage({ path: value, file: files });
      console.log(name);
      console.log(value);
      console.log(files[0]);
    }
  };
  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(tempImage);
  };
  let loadUserImage = async () => {
    // const url = `${apiprefix}/users/${localStorage.olivia_pid}/avatar`;
    // setLoading(true);
    // let response = await makeAPICall('GET', url);
    // if (response.status === 200) {
    //   let rbody = await response.json();
    //   setLoading(false);
    setPreviewImage(
      <img
        src={`${localStorage.avatar}`}
        className={classes.circularPreview}
        alt="user-profile"
      />
    );
    // } else {
    //   setLoading(false);
    // }
  };
  //const { classes } = props;
  useEffect(() => {
    loadUserImage();
  }, []);

  return (
    <>
      <main className={classes.main}>
        <CssBaseline />
        <div align="center">{previewImage}</div>
        <form id="imgform" onSubmit={handleSubmit} className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <Input
              accept="image/*"
              onChange={handleChange}
              className={classes.input}
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
            />
            <InputLabel htmlFor="raised-button-file">
              <Button
                variant="raised"
                component="span"
                className={classes.chooseFile}
              >
                Choose File
              </Button>
              <Typography>{tempImage.path}</Typography>
            </InputLabel>
          </FormControl>
          {isLoading ? (
            <div align="center" style={{ paddingTop: '4px' }}>
              <CircularProgress />{' '}
            </div>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Upload
            </Button>
          )}
        </form>
      </main>
    </>
  );
}

ImageForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageForm);
