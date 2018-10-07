
const financeTips = require("./financeTips.json");
const tickersData = require("./companyTickers.json");

module.exports = {
    findBalance: function(json) {
        const balanceAmount = json.balance
        var speech = ("Your balance is $" + balanceAmount)

        console.log("findBalance hit")
        return speech;
    },
<<<<<<< Updated upstream
    addValueToChildAccount: function(json) {
        const valueAdded = json.objectCreated.amount
        var speech = ("Sure thing! I added " + valueAdded + " into my tummy.")

        console.log("addValue hit")
        return speech;
    },
    changeGoal: function(json) {
        const goalAmount = json.balance
=======
    changeGoal: function(json, goalAmount) {
>>>>>>> Stashed changes
        var speech = ("Your new goal is $" + goalAmount)

        console.log("changeGoal hit")
        return speech; 
    },

    transferMoney: function(json) {
        const amountTransferred = json.objectCreated.amount
        var speech = ("You have transferred $" + amountTransferred + " to Mark's account")
        
        console.log("transferMoney hit")
        say.speak(speech)
        return speech
    },
    saveMoney: function(json) {
        const transactionAmount = 0;
        var hash = {}
        var category

        amountsArr = json.map(function(o) {
            return o.amount;
        })
        categoriesArr = json.map(function(o) {
            return o.description;
        })

        for (category in categoriesArr) {
            hash[categoriesArr[category]] = amountsArr[category]
        }

        var maxCategory = Object.keys(hash).reduce(function(a, b) {
            return hash[a] > hash[b] ? a : b
        })

        var maxCategoryAmount = hash.health.toString()

        var speech = ("In the last month, you've spent a grand total of $"
        + maxCategoryAmount + " on " + maxCategory + ". This was your highest "
        + "expense. " + financeTips[maxCategory])

        console.log("saveMoney hit")
        say.speak(speech)
        return speech
    },
    findBill: function(json){
        const status = json[0].status
        const payee = json[0].payee
        const payment_date = json[0].payment_date
        const payment_amount = json[0].payment_amount
        const recurring_date= json[0].recurring_date
        var speech = ("You have one bill due. Your " + payee + " bill is due on "+ payment_date+" in the amount of $"+ payment_amount+". This bill reoccurs on the "+ recurring_date +"st of every month.")
       
        console.log("findBill hit")
        say.speak(speech)
        return speech;
    },
    payBill: function(json){
        const status = json[0].status
        const payee = json[0].payee
        const payment_date = json[0].payment_date
        const payment_amount = json[0].payment_amount
        const recurring_date= json[0].recurring_date
        var speech = "$" + payment_amount + ".00 has been applied to your Capital One Credit Card bill. Your amount due is now $0.00.";
       
        console.log("findBill hit")
        say.speak(speech)
        return speech;
    }
}
