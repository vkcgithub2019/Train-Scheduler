$(document).ready(function () {

  // 1. Initialize Firebase
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
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  // Capture Button Click for adding trains
  $("#addTrain").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes/user input
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var freq = $("#interval").val().trim();

    // creates local "temporary" object for holding train data- use the push method to upload train data to the database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq
    });
  });


  // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
  database.ref().on("child_added", function (childSnapshot) {
// storing everything into a variable
    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
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

    // Clear input fields
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },
    //Handle the errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

}); //end document ready
