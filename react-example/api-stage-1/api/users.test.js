/* Unit tests for API stage 1 */

// file backing the user database for inspection and help with debugging
const udb = `${__dirname}/testuserdatabase.csv`;
const nconf = require('nconf');
nconf.defaults({
  userdatabase: udb
});
const bcrypt = require('bcrypt');

// now that nconf defaults are set, we can require api which will use nconf defaults.
const api = require('../api');
const userdb = require('./csvuserdatabase');

const request = require('supertest');

describe('Basic API Tests', function() {
  it('checks that the API is up', async () => {
    const res = await request(api)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200);
    const response = res.body;
    expect(response.status).toBeTruthy();
    expect(response.message).toBe('API is accessible');
  });
});

/*
 * Generally, we would want specs to be independent so that the testing framework
 * can execute them in random order.  Here, however, I am relying on jest
 * executing them in order as per
 * https://jestjs.io/docs/en/setup-teardown#order-of-execution-of-describe-and-test-blocks
 */
describe('Test User Database Deletion', function() {
  it('tests that the user database can be reset', async () => {
    return request(api)
      .delete('/api/users')
      .expect(200);
  });
});

// http://listofrandomnames.com
const users = [
  'Brinda Breau',
  'Stephania Sollers',
  'Kourtney Keels',
  'Tamatha Tiggs',
  'Melanie Montijo',
  'Roselyn Relf',
  'Eugenio Eppinger',
  'Racheal Reeves',
  'Tomeka Townsley',
  'Brittani Breeden',
  'Cuc Cavallo',
  'Santana Stolz',
  'Josiah Jerkins',
  'Jerrold Jolin',
  'Leigh Langner',
  'Sunday Shulman',
  'Aimee Asay',
  'Jessie Jun',
  'Gerard Gayhart',
  'Xiomara Xiong',
  'Tijuana Tsao',
  'Lucilla Longtin',
  'Madaline Mayson',
  'Charisse Casey',
  'Genia Goldfarb',
  'Doreatha Dampier',
  'Daniella Devoe',
  'Dyan Duquette',
  'Anne Allensworth',
  'Delena Dinan'
].map(fullname => {
  let [first, last] = fullname.split(/\s+/);
  return {
    name: first.toLowerCase().charAt(0) + last.toLowerCase(),
    password: last
      .split('')
      .reverse()
      .join(''),
    fullname
  };
});

describe('Test User Creation', function() {
  for (let user of users) {
    it(`tests that user ${user.name} can be created`, async () => {
      const res = await request(api)
        .post('/api/users')
        .send(user)
        .expect(200);
      expect(res.body).toHaveProperty('id');
      user.id = res.body.id;
    });
  }
  it(`tests that attempts to create incomplete users are rejected`, async () => {
    return request(api)
      .post('/api/users')
      .send({ fullname: 'Mr. NoName & NoPassword' })
      .expect(400);
  });

  it(`tests that attempts to create users w/o password are rejected`, async () => {
    return request(api)
      .post('/api/users')
      .send({ fullname: 'Mrs. NoPassword', name: 'mrsnopassword' })
      .expect(400);
  });
});

describe('Test User Creation', function() {
  const { id, ...usersansid } = users[0]; // eslint-disable-line no-unused-vars
  it(`tests that existing users can't be created again with the same name`, async () => {
    await request(api)
      .post('/api/users')
      .send(usersansid)
      .expect(409);
  });
});

describe('Test Post User Creation', function() {
  for (const user of users) {
    it(`tests that user ${user.name} can be retrieved`, async () => {
      let res = await request(api)
        .get(`/api/users/${user.id}`)
        .expect(200)
        .expect('Content-Type', /json/);

      const ruser = res.body;
      expect(ruser.name).toEqual(user.name);
      expect(ruser.fullname).toEqual(user.fullname);
      expect(ruser).not.toHaveProperty('password');
    });
  }

  it('tests that users can be listed', async () => {
    let res = await request(api)
      .get(`/api/users`)
      .expect(200);
    const { users: rusers } = res.body;
    for (const { name, id } of users) {
      expect(rusers).toContainEqual({ name, id });
    }
  });

  let usera = users[0];
  it('tests that a user can be deleted', async () => {
    await request(api)
      .delete(`/api/users/${usera.id}`)
      .expect(200);
    return request(api)
      .get(`/api/users/${usera.id}`)
      .expect(404);
  });

  let userb = users[1];
  it("tests that a user's fullname and password can be updated", async () => {
    await request(api)
      .put(`/api/users/${userb.id}`)
      .send({ fullname: 'Stephania Kellogg', password: 'new password' })
      .expect(200);
    let res = await request(api)
      .get(`/api/users/${userb.id}`)
      .expect(200);
    const ruser = res.body;
    expect(ruser.fullname).toBe('Stephania Kellogg');
    userb.fullname = 'Stephania Kellogg';
    userb.password = 'new password';
  });
});

describe('Test Post User Creation', function() {
  const byName = {};
  users.forEach(user => (byName[user.name] = user));

  it('tests that users can be listed', async () => {
    let res = await request(api)
      .get(`/api/users`)
      .expect('Content-Type', /json/)
      .expect(200);
    const { users: rusers } = res.body;
    const justName = ({ name }) => name;
    const have = new Set(rusers.map(justName));
    const shouldBe = new Set(
      users
        .slice(1) // first one was deleted
        .reverse()
        .map(justName)
    );
    expect(have).toEqual(shouldBe);
    return Promise.all(
      rusers.map(async ruser => {
        const {
          body: { name, id, fullname }
        } = await request(api)
          .get(`/api/users/${ruser.id}`)
          .expect('Content-Type', /json/)
          .expect(200);
        expect(name).toBe(ruser.name);
        expect(id).toBe(ruser.id);
        expect(fullname).toBe(byName[name].fullname);
      })
    );
  });

  it('checks that all passwords are encrypted properly', async () => {
    let usersinfile = await userdb(udb);
    return Promise.all(
      users.slice(1).map(async user => {
        let storeduser = usersinfile.getByName(user.name);
        expect(usersinfile.byName.has(user.name)).toBeTruthy();
        expect(
          await bcrypt.compare(user.password, storeduser.password)
        ).toBeTruthy();
      })
    );
  });
});
