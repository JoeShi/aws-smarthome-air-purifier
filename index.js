'use strict'

const AWSIoT = require('aws-iot-device-sdk');
const ThingName = 'air-purifier-1';
const serial = require('./serial');
const fan = require('./fan');

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
    const newState = {
      state: {
        reported: {
          fan: status
        }
      }
    }
    if (status === 'on') {
      fan.start().then(() => {
        thingShadow.update(thingName, newState)
      })
    } else if (status === 'off') {
      fan.stop().then(() => {
        thingShadow.update(thingName, newState)
      })
    }
  } else {
    console.log('state is same')
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
