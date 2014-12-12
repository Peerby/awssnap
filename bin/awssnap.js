/* jshint node: true */
"use strict";
var fs = require('fs');
var util = require('util');


var async = require('async');
var cmd = require('commander');
var log = require('winston');

var awssnap = require('../awssnap');


/**
 * Parse commandline options
 */
cmd.option('-p, --period <period>', 'period to process for volume');
cmd.option('-c, --config [file]', 'config file to use');
cmd.option('-l, --loglevel [loglevel]', 'config file to use');
cmd.option('-d  --dryrun, do dry run');
cmd.parse(process.argv);
if (!cmd.period) cmd.help();
// Set defaults
cmd.config = cmd.config || process.cwd() + '/awssnap.json';
cmd.loglevel = process.env.NODE_LOGLEVEL || cmd.loglevel || 'info';


/**
 * Setup logger
 */
log.level = cmd.loglevel;
log.verbose('awssnap arguments', {
  period: cmd.period,
  config: cmd.config,
  loglevel: cmd.loglevel,
  dryRun: cmd.dryRun
});

/**
 * Main
 */
async.waterfall([readConfig, createSnapshots], function (err, state) {
  if (err) throw err;
  console.log('done');
});


/**
 * Read configuration file
 */
function readConfig(done) {
  var fileName = cmd.config;
  log.verbose('Reading configuration file', {filename: fileName});

  fs.readFile(fileName, {encoding: 'UTF8'}, function (err, contents) {
    if (err) return done(err);

    var jsonData;
    try {
      jsonData = JSON.parse(contents);
    }
    catch (err) {
      return done(err);
    }

    // console.log('** config', jsonData);
    return done(null, {config: jsonData});
  });
}


function createSnapshots(state, done) {
  var config = state.config;

  var periodInfo = config.periods[cmd.period];
  if (!periodInfo) {
    return done(new Error('Invalid period: '+cmd.period));
  }

  async.each(Object.keys(config.volumes), createSnapshot, done);
  return;

  function createSnapshot(volume, cb) {
    var params = {
      region: config.volumes[volume].region,
      volume: config.volumes[volume].volume,
      description: config.volumes[volume].description +' '+ cmd.period,
      dryRun: cmd.dryrun
    };
    log.info('creating snapshot', params);

    awssnap.createSnapshot(params, function (err, result) {
      if (err) return done(err);

      log.debug('created snapshot', params);
      return done(null, state);
    });
  }
}


