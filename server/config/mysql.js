'use strict';
var mysql = require('mysql')
  , async = require('async');

var state = {
  pool: null,
}

exports.connect = function(pool, done) {
  state.pool = mysql.createPool(pool);
  done()
}

exports.get = function() {
  return state.pool;
}

exports.fixtures = function(data) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  var names = Object.keys(data.tables)
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      var keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" })

      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
    }, cb)
  }, done)
}

exports.drop = function(tables, done) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  async.each(tables, function(name, cb) {
    pool.query('DELETE * FROM ' + name, cb)
  }, done)
}

exports.pagination = function(query,option,done) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))
  
  var myRegexp = /from (.*?)order by/i;
  var match = myRegexp.exec(query);
  if (!match || !match[1]) return done(new Error('Intex Error in query'))
  // console.log('SELECT COUNT(1)numRows  FROM ' + match[1])
  pool.query('SELECT COUNT(1)numRows  FROM ' + match[1],function(err,row){
    var numRows = 0;
    if (err) return done(new Error(err))
    if (row.length > 0 ) { numRows = row[0].numRows }
    else{ return done(null,{count:numRows,results:[] }) }
    pool.query(query + ' limit '+option.start+","+option.length,function(err,row){
      if (err) return done(new Error(err))
      return done(null,{draw:option.draw,recordsTotal:numRows,recordsFiltered:numRows,data:row }) 
    })
  })
}