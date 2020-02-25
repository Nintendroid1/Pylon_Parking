React Frontend, Stage 1
=======================

In this assignment, we repeat the tasks from the last assignment, but this
time using the [React](https://reactjs.org) framework.

The learning goal is to get started with React by examining, building, and 
combining React components.  You will also become familiar with its associated 
toolchain including create-react-app and webpack.

Preparation:
-------------

You will need to work with your stage 2 or 3 backend repository, just like
in the previous project.  Since create-react-app's development server uses port 3000,
start your API on port 3001, e.g.:
```
env PORT=3001 node main.js
```
(These commands need to be issued in the other repository.)

To get started with this repository, install the required packages with
`npm install`, then start the development server with `npm run start`.
Note that you do not need to run `create-react-app` - this repository is a
snapshot of a project directory created with `create-react-app`.

The package.json contains a entry to facilitate [proxying API requests during 
development](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development)
which is pointing at `http://localhost:3000` 

Requirements
------------

The partial application provided in this repository provides 2 tabs and one form
to register a new user.  You should add the following:

- a tab to login in as a user.  This should save the obtained token in localStorage.

- a tab to display your "profile", that is, the current user's name, fullname, and id.

- a tab to list all users (if the user is currently logged in as an administrator).
  You can use a "refresh" button to retrieve the current list. 

- all tabs should have proper error handling for when the API call fails that informs
  the user of the error that occurred.

- a spinner that spins while an API request is in progress.

Setup:
------

For the assignment, you should first fork the project on git.cs.vt.edu, then set
your fork to be private, then clone your fork onto your machine.
If you're in doubt about any of these steps, ask!

Start by reading the provided code.

Submission
-----------

To submit, please commit your changes to your clone, push them to your fork 
on git.cs.vt.edu, then use the zip file download feature on git.cs.vt.edu to 
prepare a zip file for submission.


-- created by gback Mar 2019
