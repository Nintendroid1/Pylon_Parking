/* Simple csv-file backed user database.
 * Except for getById and getByName, all methods are async and
 * return a promise.
 */
const fs = require('fs');
const csv = require('csv-parser');
const csvWriter = require('csv-write-stream');

module.exports = userdbfilename =>
  new Promise(async (fulfill, reject) => {
    let users = {
      nextid: 0,
      byName: new Map(),
      byId: new Map(),
      /* Save user database to a .csv file */
      save: function() {
        return new Promise((fulfill, reject) => {
          const writer = csvWriter({
            headers: ['id', 'name', 'password', 'fullname']
          });
          const outputfile = fs.createWriteStream(userdbfilename);
          writer.pipe(outputfile);
          for (const [name, user] of this.byName) {
            writer.write([user.id, name, user.password, user.fullname]);
          }
          writer.end();
          writer.on('error', () => {
            reject();
          });
          outputfile.on('error', () => {
            reject();
          });
          outputfile.on('finish', () => {
            fulfill();
          });
        });
      },
      /* Retrieve user by name. */
      getByName: function(name) {
        return this.byName.get(name);
      },
      /* Retrieve user by id. */
      getById: function(id) {
        return this.byId.get(id);
      },
      /*
       * Add a user, assign an id, return the id upon successful save
       */
      add: async function(user) {
        user.id = this.nextid++;
        this.byName.set(user.name, user);
        this.byId.set(user.id, user);
        await this.save();
        return user.id;
      },
      /*
       * Delete a user with a given (numeric) id
       */
      delete: function(id) {
        const user = this.byId.get(id);
        this.byName.delete(user.name);
        this.byId.delete(user.id);
        return this.save();
      },
      /*
       * Clear the user database.
       */
      clear: function() {
        this.nextid = 0;
        this.byName.clear();
        this.byId.clear();
        return this.save();
      }
    };
    /* Read existing database, if any */
    fs.createReadStream(userdbfilename)
      .on('error', err => {
        // any error except "file not found" will lead to rejection
        if (err.code == 'ENOENT') {
          fulfill(users);
        } else {
          reject(err);
        }
      })
      .pipe(csv())
      .on('data', user => {
        user.id = Number(user.id);
        users.byName.set(user.name, user);
        users.byId.set(user.id, user);
        if (user.id >= users.nextid) {
          users.nextid = user.id + 1;
        }
      })
      .on('end', () => {
        fulfill(users);
      })
      .on('error', err => {
        reject(err);
      });
  });
