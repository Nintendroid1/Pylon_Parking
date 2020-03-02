/**
 * Mini caching layer using Redis.
 * 
 * Provides the ability to store a flat objects whose properties are strings or 
 * convertible to strings in a Redis hash map.
 */
// require redis and promisify it
const redis = require("redis"),
      client = redis.createClient();

const nconf = require('nconf');

// As per: https://github.com/NodeRedis/node_redis#bluebird-promises
// we could use Bluebird's promisifyAll method like so.
// const bluebird = require('bluebird');
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);
// but we'll stick with native promises as per
// https://github.com/NodeRedis/node_redis#native-promises
const {promisify} = require('util');
const [ delAsync, hgetallAsync, hmsetAsync, flushAll, shutdown, scanAsync ] = 
  ['del', 'hgetall', 'hmset', 'flushall', 'quit', 'scan']
  .map((funcname) => promisify(client[funcname]).bind(client));

// define this prefix in the configuration.  For instance,
// "testapi" for testing, "realapi" for running in production
const redisprefix = nconf.get('redisprefix');
const makeKey = (type, id)  => `${redisprefix}:${type}:${id}`;

function invalidateObject(type, id) {
  // https://redis.io/commands/del
  return delAsync(makeKey(type, id))
}

/* Retrieve an object from the cache under (type, id) 
 * Note: upon success, all properties will be of type string.
 */
function findObject(type, id) {
  // see https://redis.io/commands/hgetall
  return hgetallAsync(makeKey(type, id))
}

/* Store an object in the cache under (type, id) */
function setObject(type, id, userobject) {
  // see https://redis.io/commands/hmset
  return hmsetAsync(makeKey(type, id), userobject)
}

/* Remove keys that start with configured prefix.
 * There is no method in Redis to remove keys matching a glob pattern,
 * but we can scan for them and then delete them in a loop.
 * This is useful for test setup and teardown.
 */
async function flushKeys(type = '*')
{
  const pattern = makeKey(type, '*');
  let deletesInProgress = [];
  let cursor = 0;
  do {
    [ cursor, matches ] = await scanAsync(cursor, 'MATCH', pattern);
    if (matches.length > 0)
      deletesInProgress.push(delAsync(...matches));
  } while (cursor != 0);
  return Promise.all(deletesInProgress);
}

module.exports = {
  invalidateObject,
  findObject,
  setObject,
  shutdown,   // shutdown connection to redis server
  flushKeys,  // flush only keys for type.
  flushAll    // flush entire redis store
}
