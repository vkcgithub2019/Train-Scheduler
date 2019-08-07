
$(document).ready(function () {
  (function () {

    var clockElement = document.getElementById( "clock" );
  
    function updateClock ( clock ) {
      clock.innerHTML = new Date().toLocaleTimeString();
    }
  
    setInterval(function () {
        updateClock( clockElement );
    }, 1000);
  
  }());
  // web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCbvC9Lw2oHNuJb4O8c055ftEVNQy5Gsd4",
    authDomain: "train-scheduler-7f6d7.firebaseapp.com",
    databaseURL: "https://train-scheduler-7f6d7.firebaseio.com",
    projectId: "train-scheduler-7f6d7",
    storageBucket: "train-scheduler-7f6d7.appspot.com",
    messagingSenderId: "423802686346",
    appId: "1:423802686346:web:608ca356177d2564"
  };
  //initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //create a variable called "database" to reference the Firebase database 
      var database = firebase.database();

  // Capture Button Click for adding trains
  $("#addTrain").on("click", function (event) {
  //this line prevents the page from refreshing when a user hits "enter"
      event.preventDefault();

  // Grabbed values from text boxes/user input and store them in a variable called trainName.
    var trainName = $("#trainName").val().trim();
  // Grabbed values from text boxes/user input and store them in a variable called destination.
    var destination = $("#destination").val().trim();
  // Grabbed values from text boxes/user input and store them in a variable called firstTrain.
    var firstTrain = $("#firstTrain").val().trim();
  // Grabbed values from text boxes/user input and store them in a variable called interval.
    var freq = $("#interval").val().trim();

  // creates local "temporary" object for holding train data- use the .push method to upload train data to the database. .ref refers to the path for saving data to the root directory. A Reference represents a specific location in your Database and can be used for reading or writing data to that Database location. This is s Firebase method.
      database.ref().push({
  //writing data to the trainName location in the database  
      trainName: trainName,
  //writing data to the destination location in the database
      destination: destination,
  //writing data to the firstTrain location in the database
      firstTrain: firstTrain,
  //writing data to the frequency location in the database
      frequency: freq
    });
  });


  // Firebase is constantly watching for data changes and when it does occurs, it will print them to console and to html, when a child is added,a list of items from the database is retrieved and then the childSnapShot will contain the required data. This codes behaves similarly to tht on('value")
  database.ref().on("child_added", function (childSnapshot) {
// storing data from childSnapShot into "trainName" variable.
    var newTrain = childSnapshot.val().trainName;
//storing data from childSnapShot into "destination" variable
    var newLocation = childSnapshot.val().destination;
//storing data from childSnapShot into "firstTrain" variable
    var newFirstTrain = childSnapshot.val().firstTrain;
//storing data from childSnapShot into "frequency" variable   
    var newFreq = childSnapshot.val().frequency;

    // using moment.js to figure the time, First Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % newFreq;

    // Minute(s) Until Train
    var tMinutesTillTrain = newFreq - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page, create the new row
    $("#all-display").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFreq +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

    // Clear input fields/text box when done so to allow new input
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },
    //Handle the errors, if there is an error that Firebase encounters, it will be stored in the "errorObject"
    function (errorObject) {
   // if there is an error, this will print the error
      console.log("Errors handled: " + errorObject.code);
    });

}); //end document ready
