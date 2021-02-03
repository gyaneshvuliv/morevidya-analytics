'use strict';
var redisPool = require('redis-connection-pool')
var redis = require('redis');
require('../../node_modules/node-redis-multi/lib/multi')(redis,true);
var state = {
  pool: null,
  connectionString: null,
  transaction : null
}

var transaction = function(done) {
  if (!state.connectionString) return done(new Error('Missing Connection String.'))
  // console.log(state.connectionString.port,state.connectionString.host)
  state.transaction = redis.createClient(state.connectionString.port,state.connectionString.host); //creates a new client
  done()
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

exports.connect = function(pool, done) {
  state.connectionString = pool;
  state.pool = redisPool('myRedisPool',pool);
  transaction(function(err){
    if (err) { console.log(err)}                                                                                                                                                                                                    
  })
  done()
}

exports.MHGETALL = function (suffix,keys, cb) {
  if (!state.transaction) return cb(new Error('Transaction Connection Missed.'))
  
  var multi = state.transaction.multi({pipeline: true});
  keys.forEach(function(key, index){
    multi.hgetall(suffix+key);
  });
  multi.exec(cb);
}
// exports.MHGETALL = function (suffix, cb) {
//   if (!state.transaction) return cb(new Error('Transaction Connection Missed.'))
  
//   var multi = state.transaction.multi({pipeline: true});
//   multi.hgetall(suffix);
//   multi.exec(cb);
// }

exports.MFIRSTKEYVALUE = function (key, cb) {
  if (!state.pool) return cb(new Error('pool Connection Missed.'))
  state.pool.keys(key, function(err, arr) {
    if (arr.length > 0) {
      state.pool.hgetall(arr[0], function(err, doc) {
        cb(err,{key:arr[0],value:doc})
      })
    }else{
      cb(err,{key:arr[0],value:{}})
    }
  })
}
exports.MHSET = function (data, cb) {
  if (!state.transaction) return cb(new Error('Transaction Connection Missed.'))

  var multi = state.transaction.multi({pipeline: true});
  data.forEach(function(result, index){
    multi.del(result.key);
    multi.hmset(result.key, result.value);
  });
  multi.exec(cb);
}
exports.get = function() {
  return state.pool;
}