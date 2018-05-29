'use strict'

const AWSIoT = require('aws-iot-device-sdk');
const Gpio = require('onoff').Gpio;
const ThingName = 'air-purifier-1';

const fan = new Gpio(22, 'low');
const buzzer = new Gpio(26, 'low');
const currentFanStatus = 'off' // on|off
const serial = require('./serial');

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
  if (state === 'on') {
    fan.writeSync(1)
  } else if (state === 'off') {
    fan.writeSync(0)
  }
  buzz(state) // buzz....
}

const thingShadow = AWSIoT.thingShadow({
  keyPath: './certs/private.pem.key',
  certPath: './certs/certificate.pem.crt',
  caPath: './certs/ca.pem',
  clientId: ThingName,
  host: 'abty4kifln98q.iot.ap-northeast-1.amazonaws.com'
})


thingShadow.register(ThingName, () => {
  const fanState = {
    state: {
      reported: {
        fan: "off"
      }
    }
  }

  const clientTokenUpdate = thingShadow.update(ThingName, fanState)

  if (clientTokenUpdate === null) {
    console.log('update shadow failed, operation still in progress')
  }
  
  console.log('register thing shadow successfully!')
})

thingShadow.on('delta', (thingName, stateObject) => {
  console.log(stateObject)
  if (stateObject.state && stateObject.state.fan) {
    const status = stateObject.state.fan
    toggleFan(status)
    const newState = {
      state: {
        reported: {
	  fan: status
	}
      }
    }
	  
     console.log(JSON.stringify(newState))
     thingShadow.update(thingName, newState)
    } else {
      console.log('state is same')
    }
  }
})


setInterval(() => {
  const density = {
    value: serial.dustDensity(),
    time: new Date()
  }
  thingShadow.publish('/airPurifiers/' + ThingName + '/dustDensity', JSON.stringify(density), function(err) {
    if (err) { console.error(err) }
  })
}, 3 * 1000)
