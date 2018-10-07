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
        console.log(results);
        assistant.add(results);
    })
  }

  function handleCheckBalanceHttp() {
    const checkBalanceAPIUrl = NESSIE_API_URL + CHILD_GOAL_ACCOUNT + "?key=" + NESSIE_API_KEY;

    return httpRequest({
        method: "GET",
        uri: checkBalanceAPIUrl,
        json: true
        }).then(function (json) {
        const speech = utilities.findBalance(json);
        return speech;
        })
        .catch(function (err) {
        console.log("Error:" + err);
        const speech = "I could not check your balance. Ask me something else.";
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
  	return handleChangeGoalHttp().then(results => {
  		console.log(results);
  		assistant.add(results);
  	});
  }

  function handleChangeGoalHttp(){
  	const changeGoalAPIUrl = NESSIE_API_URL + CHILD_GOAL_ACCOUNT +"?key="+ NESSIE_API_KEY;

     return httpRequest({
     	method: "GET",
      	uri: changeGoalAPIUrl,
      	json: true
    	}).then(function(json){
      	const speech = utilities.changeGoal(json);
      	return speech; 
    	})
    	.catch(function(err){
      	console.log("Error:" + err);
      	const speech = "I cannot understand that request. Ask me something else";
      	return speech; 
    });
  }


  //*****************************
  // Transfer Action
  //*****************************

  //Action name for getting last transaction
  const TRANSFER_MONEY_ACTION = "transferMoney"
  //Handler function for getting the last transaction
  function handleTransferMoney(assistant) {
    //1. Declare amount to be transferred (input from user)
    const TRANSFER_AMOUNT_ARG = "transferAmount"
    //2. Extract day of week from the assistant
    const transferAmount = parseFloat(assistant.getArgument(TRANSFER_AMOUNT_ARG));
    const nessieAPIUrl = NESSIE_API_URL + CUSTOMER_ACCOUNT +"/transfers?key="+ NESSIE_API_KEY;

    httpRequest({
      method: "POST",
      uri: nessieAPIUrl,
      json: true,
      body: {
          "medium": "balance",
          "payee_id": "59275453ceb8abe24250de9c",
          "amount": transferAmount,
          "transaction_date": "2017-05-25",
          "description": "string"
      }
    }).then(function(json){
      const speech = utilities.transferMoney(json);
      utilities.replyToUser(request, response,assistant, speech);
    })
    .catch(function(err){
      console.log("Error:" + err);
      const speech = "I cannot understand that request. Ask me something else";
      utilities.replyToUser(request, response, assistant, speech);
    });
  }

  //*****************************
  // Find Bill Action
  //*****************************

  //Action name for getting last transaction
  const FIND_BILL = "findBill"
  //Handler function for getting the last transaction
  function handleFindBill(assistant) {
    const nessieAPIUrl = NESSIE_API_URL + CUSTOMER_ACCOUNT +"/bills?key="+ NESSIE_API_KEY;
    httpRequest({
      method: "GET",
      uri: nessieAPIUrl,
      json: true
    }).then(function(json){
      const speech = utilities.findBill(json);
      utilities.replyToUser(request, response,assistant, speech);
    })
    .catch(function(err){
      console.log("Eror:"+err);
      const speech = "I cannot understand that request. Ask me something else";
      utilities.replyToUser(request, response, assistant, speech);
    });
  }

  //*****************************
  // Pay Bill Action
  //*****************************

  const PAY_BILL = "payBill"
  //Handler function for getting the last transaction
  function handlePayBill(assistant) {
    const nessieAPIUrl = NESSIE_API_URL + CUSTOMER_ACCOUNT +"/bills?key="+ NESSIE_API_KEY;
    httpRequest({
      method: "GET",
      uri: nessieAPIUrl,
      json: true
    }).then(function(json){
      const speech = utilities.payBill(json);
      utilities.replyToUser(request, response,assistant, speech);
    })
    .catch(function(err){
      console.log("Eror:"+err);
      const speech = "I cannot understand that request. Ask me something else";
      utilities.replyToUser(request, response, assistant, speech);
    });
  }

  //*****************************
  // Save Money Action
  //*****************************
  //Action name for getting last transaction
  const SAVE_MONEY_ACTION = "saveMoney"
  //Handler function for getting the last transaction
  function handleSaveMoney(assistant) {
    const nessieAPIUrl = NESSIE_API_URL + CUSTOMER_ACCOUNT + "/purchases?key=" + NESSIE_API_KEY;

    httpRequest({
      method: "GET",
      uri: nessieAPIUrl,
      json: true,
    }).then(function(json){
      const speech = utilities.saveMoney(json);
      utilities.replyToUser(request, response, assistant, speech);
    })
    .catch(function(err){
      console.log("Error:" + err);
      const speech = "I cannot understand that request. Ask me something else";
      utilities.replyToUser(request, response, assistant, speech);
    });
  }
  //Create a map of potential actions that a user can trigger
  const actionMap = new Map();

  //For each action, set a mapping between the action name and the handler function
  actionMap.set(WELCOME_ACTION, handleWelcome);
  actionMap.set(CHECK_BALANCE_ACTION, handleCheckBalance);
  actionMap.set(FIND_LAST_TRANSACTION_ACTION, handleLastTransaction);
  actionMap.set(CHANGE_GOAL_ACTION, handleChangeGoal);
  actionMap.set(TRANSFER_MONEY_ACTION, handleTransferMoney);
  actionMap.set(FIND_BILL, handleFindBill);
  actionMap.set(PAY_BILL, handlePayBill);
  actionMap.set(SAVE_MONEY_ACTION, handleSaveMoney);


  //Register the action map with the assistant
  assistant.handleRequest(actionMap);
});

// Start the server on your local machine
const server = app.listen(app.get("port"), function () {
  console.log("App listening on port %s", server.address().port);
  console.log("Press Ctrl+C to quit.");
});

