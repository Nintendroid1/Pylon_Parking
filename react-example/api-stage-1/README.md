User API, Stage 1
==================

Requirements:
-------------

In this assignment, you will be writing code for the first stage of the user management
component of your application.  You will be building a simple [REST](https://restfulapi.net/) 
API that has the ability to add users, assign ids to them, store their username, full name, 
and password, and retrieve information about users and delete users.

You must support the following end points:

    GET     /api/users       Lists all users
    POST    /api/users       Create a new user and return its id
    DELETE  /api/users       Delete the entire user database
    GET     /api/users/:id   Retrieve a user's information
    PUT     /api/users/:id   Update a user's information
    DELETE  /api/users/:id   Delete a user identified by its id

Setup:
------

For the assignment, you should first fork the project on git.cs.vt.edu, then set 
your fork to be private, then clone your fork onto your machine.
If you're in doubt about any of these steps, ask!

Linting and formatting:
-----------------------

For this project, I have set up ESLint and Prettier as per package.json.
We do not use any transpiler for this project, however, so you cannot use any
ES6 features that would require translation at this point (specifically, we will
use CJS and not ES6 modules).

There are checklintrules and checkformatting rules in package.json you should
use.  Since we are using the JavaScript dialect that's natively supported by
node as of today, I am not using the react-app ESLint presets; rather, I am using
the [ESLint recommended](https://eslint.org/docs/rules/) rules plus some additional
one.  You may add additional warnings to the "rules" section in package.json if
you like, but you may not remove any.

Submission
-----------

You will be submitting the entire project directory, but you may
not make changes to the tests file we provide.

Hints
-----

You should first read the provided .js files. 
Your main work will be in `api/users.js`

Authentication is out of the scope of this assignment.

For this project, all requests are sent via JSON in the body, and all responses use JSON.
For the required format of the requests/responses, read the provided unit tests. 

I provided a script that shows how to interact with the API via curl.
When run, you should see this output:
```
  deleting user database...
  {
    "message" : "database deleted"
  }
  creating user gback...
  {
    "message" : "user created",
    "id" : 0
  }
  getting information about user 0...
  {
    "fullname" : "Dr Back",
    "id" : 0,
    "name" : "gback"
  }
  get list of all users
  {
    "users" : [
        {
          "id" : 0,
          "name" : "gback"
        }
    ]
  }
```

The user database is maintained in a .csv file.  The location of this .csv file must be
read via [nconf](https://www.npmjs.com/package/nconf), looking for the `userdatabase` key.
E.g.
```javascript
const nconf = require('nconf');
const udb = nconf.get('userdatabase')

// now udb has the name of the user database file you should use
```

-- created by gback Feb 2019
