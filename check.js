function handleCheckBalanceHttp() {
    const checkBalanceAPIUrl = "http://api.reimaginebanking.com/accounts/"
    + CHILD_GOAL_ACCOUNT + "?key=" + NESSIE_API_KEY;

    return httpRequest({
        method: "GET",
        uri: checkBalanceAPIUrl,
        json: true
        }).then(function (json) {
        const speech = utilities.findBalance(json, assistant);
        return speech;
        })
        .catch(function (err) {
        console.log("Error:" + err);
        const speech = "I could not check your balance. Ask me something else.";
        return speech;
    });
  }