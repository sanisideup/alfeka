const SerialPort = require('serialport')
const port = new SerialPort('/dev/tty.usbmodem14131')

// A = LED AND EARS
// B = EARS
// C = LEDS

const financeTips = require("./financeTips.json");
const tickersData = require("./companyTickers.json");

module.exports = {
    findBalance: function(json) {
        const balanceAmount = json.balance
        var speech = ("Your balance is $" + balanceAmount)


        port.write('B', function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
            console.log('message written')
        })

        console.log("findBalance hit")
        return speech;
    },
    addValueToChildAccount: function(json) {
        const valueAdded = json.objectCreated.amount
        var speech = ("Sure thing! I added " + valueAdded + " into my tummy.")

        // sends alfeka commands
        port.write('A', function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
            console.log('A message written')
        })

        console.log("addValue hit")
        return speech;
    },
    changeGoal: function(json, goalAmount) {
        var speech = ("Your new goal is $" + goalAmount)

        port.write('C', function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
            console.log('A message written')
        })

        console.log("changeGoal hit")
        return speech; 
    }
}
