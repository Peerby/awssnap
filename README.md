# awssnap

## Description

A small library / commandline tool to create snapshots of Amazon volumes

## TODO:

* The cleanup part


# Installation

install for the library

    npm install awssnap

install for the tool

    npm -g install awssnap


# Setup

The following steps will tell you how to setup your environment to use for ebsdeploy.


## Create environment

Create a file named ~/.aws/credentials and add the following content


  [default]
  aws_access_key_id=<your key>
  aws_secret_access_key=<your key>


## Configuration

Example configuration file:

```
{
  "volumes": {
    "db1": {
      "region": "eu-west-1",
      "volume": "vol-abcdefgh",
      "description": "db1 backup"
    },
    "db2": {
      "region": "eu-west-1",
      "volume": "vol-bbccddee",
      "description": "db2 backup"
    }
  },
  "periods": {
    "daily": {
      "keep": 7
    },
    "weekly": {
      "keep": 4
    }
  }
}
```

## running

Commandline arguments:
```
-p, --period <period>     - period to process for volume
-c, --config [file]       - config file to use
-l, --loglevel [loglevel] - config file to use
-d  --dryrun,             - do dry run
```
