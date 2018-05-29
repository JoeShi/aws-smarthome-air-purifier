'use strict'

const Gpio = require('onoff').Gpio;
const fan = new Gpio(17, 'low'); // BCM number
const buzzer = new Gpio(12, 'high'); // BCM number, hight is off
let status = 'off'  // current status of fan


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

toggleBuzzer('on', 50).then(() => {
  return toggleBuzzer('off', 50)
}).then(() => {
  return toggleBuzzer('on', 50)
}).then(() => {
  return toggleBuzzer('off', 50)
}).then(() => {
  console.log('finished')
})

module.exports.start = function() {
  fan.writeSync(0)
}

module.exports.stop = function () {
  fan.writeSync(1)
}

