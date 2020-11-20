import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true, 
        unique: true
    },
    userId: {
        type: String, required: true
    },         // the author of the report
    incidentId: {
        type: String, required: true
    },     // the incident related to this report
    agencyId: {
        type: String, required: true
    },      // the agency that the author belongs to
    date: {
        type: String
    },
    comments : {
        type: String
    },
    isOpen : {
        type : Boolean , required : true
    }
});

module.exports = new mongoose.model("Report", reportSchema);