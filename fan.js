'use strict'

const Gpio = require('onoff').Gpio;
const fan = new Gpio(22, 'low');
const buzzer = new Gpio(26, 'low');
let status = 'off'  // current status of fan

/**
 * Create a buzz sound based on status.
 * @param status
 */
const buzz = (status = 'off') => {
  if (status === 'on') {
    buzzer.writeSync(1);
    setTimeout(() => {
      buzzer.writeSync(0)
      setTimeout(() => {
        buzzer.writeSync(1)
        setTimeout(() => {
          buzzer.writeSync(0)
        }, 100)
      }, 100)
    }, 100)
  } else if (status === 'on') {
    buzzer.writeSync(1);
    setTimeout(() => {
      buzzer.writeSync(0)
    }, 300)
  }
}

/**
 * Toggle the fan status
 * @param state the desired state
 */
const toggleFan = (state = 'off') => {
  buzz(state) // buzz....
}

module.exports.start = function() {
  fan.writeSync(1)
}

module.exports.stop = function () {
  fan.writeSync(0)
}