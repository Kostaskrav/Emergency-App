import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    userId : {                          // head of agency
        type : String
    },
    address: String,
    users : Array,                      // units of this agency
});

module.exports = new mongoose.model("Agency", agencySchema);