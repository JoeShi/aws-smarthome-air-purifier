'use strict';

const SerialPort = require('serialport')
const port = new SerialPort('/dev/tty-usbserial1')
let dustDensity = 0.0

port.on('error', function (err) {
  console.error(err)
})

port.on('data', function (data) {
  const value = data.toString()
  if (value.startsWith('dustDensity: ')) {
    dustDensity = parseFloat(value.substring(10))
    console.log('received dustDensity: ' + dustDensity)
  }
})

module.exports.dustDensity = dustDensity