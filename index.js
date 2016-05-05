#!/usr/bin/env node

var proj4 = require('proj4')
var csv = require('csv-parser')
var csvwriter = require('csv-write-stream')
var through = require('through2')

var proj = proj4(process.argv[2], process.argv[3] || 'WGS84')

process.stdin.pipe(csv())
.pipe(through.obj(function write (row, _, next) {
  var coords = [row.X, row.Y]
  var projected = proj.forward(coords)
  row.X = projected[0]
  row.Y = projected[1]
  next(null, row)
}))
.pipe(csvwriter())
.pipe(process.stdout)

