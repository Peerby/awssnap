/* jshint node: true */
"use strict";
var AWS = require('aws-sdk');
var numpad = require('numpad');

function createSnapshot(params, done) {

  if (!params.volume) return done('no volume specified');
  if (!params.description) return done('no description specified');
  if (!params.region) return done('no region specified');

  setRegion(params.region);

  var ec2 = new AWS.EC2();
  var ec2params = {
    VolumeId : params.volume,
    Description: params.description +' '+ getTimeString(),
    DryRun: params.dryRun
  };

  ec2.createSnapshot(ec2params, function (err, data) {
      if (err) return done(err);
      return done(null, data);
  });
}


function purgeSnapshot(state, periodInfo, done) {

}


/**
 * Helper functions
 */
function setRegion(region) {
  if (!region) throw new Error('No region specified');

  if (AWS.config.region === region) return;
  AWS.config.region = region;
}


function getTimeString() {
  var d = new Date();
  return d.getFullYear() + numpad(d.getMonth()) + numpad(d.getDay()+1) + '-' +
        numpad(d.getHours()) + numpad(d.getMinutes());
}


/**
 * Exports
 */
exports.createSnapshot = createSnapshot;
exports.purgeSnapshot = purgeSnapshot;
