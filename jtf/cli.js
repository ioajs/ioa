#!/usr/bin/env node
'use strict';

const cluster = require('cluster');

if (cluster.isMaster) {

   require('./bin/master')

} else {
   
   require('./bin/worker/')

}