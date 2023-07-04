const { CarParking } = require("../models/parkingModel");

// function generateRandomCharacter() {
//   // Generate a random number between 0 and 25
//   var randomNumber = Math.floor(Math.random() * 26);

//   // Convert the random number to a character code (ASCII)
//   var charCode = 97 + randomNumber; // ASCII code for lowercase 'a' is 97

//   // Convert the character code to a character
//   var randomCharacter = String.fromCharCode(charCode);

//   return randomCharacter;
// }
let slots = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const addParkingArea = async (req, res) => {

  console.log("location admin has added",req.body)
  try {
    const { location } = req.body;
    const parkingData = {
      parkingLotName: "",
      userName: "",
      parkingSpaceNumber: 1,
      entryTime: null,
      exitTime: null,
      BookedTime: null,
      totalParkingTime: 0,
      booked: false,
      perHourFee: 1000,
      location,
    };
    const initialData = new Array(9);
    const slotsArray = initialData.fill(0).map((item, index) => {
      return { ...parkingData, parkingLotName: `Lot ${slots[index]}` };
    });
    // console.log(slotsArray, "fhhhhhhhhhhhhhhhhhhhhhhhh");
    const data = await CarParking.insertMany(slotsArray);
    // console.log(data);
    res.end("done");
  } catch (err) {}
};

module.exports = {
  addParkingArea,
};
