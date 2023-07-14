const { CarParking } = require("../models/parkingModel");
let slots = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const addParkingArea = async (req, res) => {

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
    const data = await CarParking.insertMany(slotsArray);
    res.end("done");
  } catch (err) {}
};

module.exports = {
  addParkingArea,
};
