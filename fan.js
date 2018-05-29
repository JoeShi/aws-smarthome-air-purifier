'use strict'

const Gpio = require('onoff').Gpio;
const fan = new Gpio(17, 'high'); // BCM number
const buzzer = new Gpio(12, 'high'); // BCM number, hight is off
let currentStatus = 'off'  // current status of fan

/**
 * Toggle a buzzer with on|off status.
 * @param {String} status on|off.
 * @param {Number} delay delay in ms.
 * @returns {Promise<>}
 */
async function toggleBuzzer(status = 'off', delay = 50){
  if (status === 'off') {
    buzzer.writeSync(1)
  } else if (status === 'on') {
    buzzer.writeSync(0)
  }

  return new Promise((resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  }))
}

module.exports.start = async function() {
  fan.writeSync(0)
  await toggleBuzzer('on', 50)
  await toggleBuzzer('off', 50)
  await toggleBuzzer('on', 50)
  await toggleBuzzer('off', 50)
  console.log('fan started...')
  currentStatus = 'on'
}

module.exports.stop = async function () {
  fan.writeSync(1)
  await toggleBuzzer('on', 200)
  await toggleBuzzer('off', 50)
  console.log('fan stopped...')
  currentStatus = 'off'
}

