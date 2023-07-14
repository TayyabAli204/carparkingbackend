const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const carParkingSchema = new Schema({
  parkingLotName: String,
  userName: String,
  parkingSpaceNumber: Number,
  entryTime: String,
  exitTime: String,
  totalParkingTime: Number,
  perHourFee: Number,
  BookedTime: String,
  booked: Boolean,
  location: String,
});
const initialData = [
  
  {
    parkingLotName: "Lot I",
    userName: "",
    parkingSpaceNumber: 9,
    booked: false,
    entryTime: null,
    exitTime: null,
    BookedTime: null,
    totalParkingTime: 0,
    perHourFee: 1000,
    location: "SUSAN ROAD FAISALABAD",
  },

];
// async function storeData
const CarParking = mongoose.model("carParkingData", carParkingSchema);
// // Insert the initial data into the database
async function storingData(req, res, next) {

  const data = await CarParking.insertMany(initialData);
  console.log(data);
  res.end("done");
}

module.exports = {
  storingData,
  CarParking,
};
