"use strict";

//Setup / Import libraries
const ApiAiAssistant = require("actions-on-google").ApiAiAssistant;
const {WebhookClient} = require('dialogflow-fulfillment');
const express = require("express");
const bodyParser = require("body-parser");
const httpRequest = require("request-promise");
require("string_score");
const utilities = require("./utilities.js"); //utilityy functions
const app = express();

app.set("port", (process.env.PORT || 8080));
app.use(bodyParser.json({type: "application/json"}));

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const CHILD_CUSTOMER_ACCOUNT = "5bb94e3ef0cec56abfa43ccb";
const CHILD_GOAL_ACCOUNT = "5bb957e8f0cec56abfa43ccd";
const PARENT_CUSTOMER_ACCOUNT = "5bb934b4f0cec56abfa43cc7";
const NESSIE_API_KEY = "1480c55ee503852320c55dd014980a60";
const NESSIE_API_URL = "http://api.reimaginebanking.com/accounts/"; 

//Register an endpoint that will listen on http://localhost:8080/
app.post("/", function (request, response) {
  //Create an instance of API.AI assistant
  const assistant = new WebhookClient({request, response});


  // **************************
  //    Welcome Action
  // **************************

  //action name for welcome
  const WELCOME_ACTION = "welcome";

  //handler function for welcome
  function handleWelcome (assistant) { //for Google Assistant only
    assistant.add("Hi, I'm alfeka - I'm you're friendly financial assistant!");
  }

  // **************************
  //  Check Balance Action
  // **************************

  //Action name for checking balance
  const CHECK_BALANCE_ACTION = "checkBalance";
  //Handler function for Nessie
  function handleCheckBalance(assistant) { 
    return handleCheckBalanceHttp().then(results => {
        assistant.add(results);
    })
  }

  function handleCheckBalanceHttp() {
    const checkBalanceAPIUrl = NESSIE_API_URL + CHILD_CUSTOMER_ACCOUNT + "?key=" + NESSIE_API_KEY;

    return httpRequest({
        method: "GET",
        uri: checkBalanceAPIUrl,
        json: true
        }).then(function (json) {
        const speech = utilities.findBalance(json);
        return speech;
        }).catch(function (err) {
        console.log("Error:" + err);
        const speech = "I could not check your balance. Ask me something else.";
        return speech;
    });
  }

  // **************************
  //  Add value to child account
  // **************************

  //Action name for checking balance
  const ADD_VALUE_ACTION = "addValueToChildAccount";
  //Handler function for Nessie
  function handleAddValueToChild(assistant) {
    const transferAmount = parseFloat(assistant.parameters.transferAmount.amount);
    return handleAddValueToChildHttp(transferAmount).then(results => {
        console.log(results);
        assistant.add(results);
    });
  }

  function handleAddValueToChildHttp(transferAmount) {
    const addValueUrl = NESSIE_API_URL + PARENT_CUSTOMER_ACCOUNT +"/transfers?key="+ NESSIE_API_KEY;

    return httpRequest({
        method: "POST",
        uri: addValueUrl,
        json: true,
        body: {
            "medium": "balance",
            "payee_id": CHILD_CUSTOMER_ACCOUNT,
            "amount": transferAmount,
            "description": "Allowance for child"
        }
        }).then(function (json) {
        const speech = utilities.addValueToChildAccount(json);
        return speech;
        })
        .catch(function (err) {
        console.log("Error:" + err);
        const speech = "I could not transfer money. Try again later";
        return speech;
    });
  }

  //******************************
  // Changing Target Goal 
  //******************************

  //Action name for changing target goal 
  const CHANGE_GOAL_ACTION = "changeGoal"; 
  //Handler function for Nessie 
  function handleChangeGoal(assistant){
  	//sets the new goal amount to goalAmount
  	const GOAL_AMOUNT_ARG = "goalAmount"
    const goalAmount = parseFloat(assistant.parameters.goalAmount.amount);

  	return handleChangeGoalHttp(goalAmount).then(results => {
  		console.log(results);
  		assistant.add(results);
  	});
  }

  function handleChangeGoalHttp(goalAmount){
      const childGoalAPIUrl = NESSIE_API_URL + CHILD_GOAL_ACCOUNT +"?key="+ NESSIE_API_KEY;

  	return httpRequest({
  		method: "GET",
  		uri: childGoalAPIUrl,
  		json: true
  		}).then(function (json) {
          var oldGoal = json.balance;
          return oldGoal;
  		}).catch(function (err) {
        console.log("Error:" + err);
    })
    .then(function(oldGoal) {
        const childGoalDepositUrl = NESSIE_API_URL + CHILD_GOAL_ACCOUNT + "/deposits?key=" + NESSIE_API_KEY; 
        const childGoalWithdrawalUrl = NESSIE_API_URL + CHILD_GOAL_ACCOUNT + "/withdrawals?key=" + NESSIE_API_KEY
        console.log("Goal amount: " + goalAmount)
        console.log("Old Amount: "+ oldGoal)
          if(goalAmount > oldGoal){
              return httpRequest({
                  method: "POST",
                  uri: childGoalDepositUrl,
                  json: true,
                  body:{
                      "medium" : "balance",
                      "description": "string",
                      "amount": goalAmount - oldGoal
              }}).then(function(json){
                  const speech = utilities.changeGoal(json, goalAmount);
                  return speech;
              }).catch(function(err){
                  console.log("Error:" + err);
              });
          }
          else{
              return httpRequest({
                  method: "POST", 
                  uri: childGoalWithdrawalUrl,
                  json: true,
                  body:{
                      "medium": "balance",
                      "amount": oldGoal - goalAmount,
                      "description": "string"
                  }}).then(function(json){
                      const speech = utilities.changeGoal(json, goalAmount);
                      return speech; 
                  }).catch(function(err){
                      console.log("Error:" + err);
                  });
          }
    })
  }
  //Create a map of potential actions that a user can trigger
  const actionMap = new Map();

  //For each action, set a mapping between the action name and the handler function
  actionMap.set(WELCOME_ACTION, handleWelcome);
  actionMap.set(CHECK_BALANCE_ACTION, handleCheckBalance);
  actionMap.set(ADD_VALUE_ACTION, handleAddValueToChild);
  actionMap.set(CHANGE_GOAL_ACTION, handleChangeGoal);

  //Register the action map with the assistant
  assistant.handleRequest(actionMap);
});

// Start the server on your local machine
const server = app.listen(app.get("port"), function () {
  console.log("App listening on port %s", server.address().port);
  console.log("Press Ctrl+C to quit.");
});

