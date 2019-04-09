/*
 * Ori Zilka
 * Nadav Lotan
 * MiLAB project
 */

// dialogflow constants
const dialogflow = require('dialogflow');
const uuid = require('uuid');

// expresses constants
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000 ;


// Set user first input interaction
global.user_input = 'help';

// Geting in active when the user connects to this server.
io.on('connection', (socket) => {
  projectId = 'abc-yryhlp'
  // A unique identifier for the given session
  const sessionId = uuid.v4();
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  runSample()

  /**
   * Send a query to the dialogflow agent, and return the query result.
   * @param {string} projectId The project to be used
   */
  async function runSample(projectId = 'abc-yryhlp') {
    try {

      console.log("This is a user input: " + user_input);

      // while (true) {
      // The text query request.
      let request = {
        session: sessionPath,
        queryInput: {
          text: {
            // The query to send to the dialogflow agent
            text: user_input,
            // The language used by the client (en-US)
            languageCode: 'en-US',
          },
        },
      };

      // Send request and log result
      let responses = await sessionClient.detectIntent(request);
      let result = responses[0].queryResult;

      console.log(`${result.fulfillmentText}`);

      socket.emit('serverMessage', `${result.fulfillmentText}`);
      console.log('serverMessage: ' + `${result.fulfillmentText}`);

      // prints the text that is from the computer to the user.
      if (result.intent) {
        // console.log(`  Intent: ${result.intent.displayName}`); // prints the name of the intent.
      } else {
        console.log(` No intent matched.`);
      }


      // // catching if there is a dialogflow answer that doesn't ask a question.
      // if (`${result.fulfillmentText}` == "Great! I'm now checking your blood pressure, please remain still for a few seconds.") {
      //   user_input = "Blood test finished"
      //   // need to insert a timeout of 10 sec for the blood pressure test.
      // } else if (`${result.fulfillmentText}` == "Blood successfully checked!") {
      //   user_input = "intro to question"
      // } else if (`${result.fulfillmentText}` == "To help me define your injury, answer the next 4 questions.") {
      //   user_input = "month"
      // } else {
      //   // user_input = readlineSync.question('');
      // }
    } catch (err) {
      console.log(err)
    }
  }
  // socket.emit('serverMessage', "Welcome to ABC. How can I help you?");

  // Tested if connected 
  console.log('one user connected ' + socket.id);

  // when the client emits 'userMessage' this executses.
  socket.on('userMessage', (message) => {

    global.user_input = message['userMessage']
    console.log(message['userMessage'])

    runSample()
  })

  // In case a user has disconnected
  socket.on('disconnect', () => {
    console.log('one user disconnected ' + socket.id);
  })
});

// Set a server connection and listen on 
server.listen(port, function () {
  console.log("listening on port 3000");
});