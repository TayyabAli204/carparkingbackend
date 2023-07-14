const mongoose = require("mongoose");

async function connection() {
  try {
    const connection = await mongoose.connect(
      process.env.dbURI
    );
  } catch (error) {
  }
}

module.exports = {
  connection,
};
