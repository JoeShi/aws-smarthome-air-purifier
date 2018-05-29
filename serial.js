'use strict';

const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 115200
}, function(err) {
  if (err) { console.error(err) }
})

let dustDensity = 0.0

port.on('error', function (err) {
  console.error(err)
})

port.on('data', function (data) {
  const value = data.toString().trim()
  if (value.startsWith('dustDensity: ')) {
    dustDensity = parseFloat(value.substring(13))
    // ived dustDensity: ' + dustDensity)
  }
})

module.exports.dustDensity = function() { return dustDensity }
