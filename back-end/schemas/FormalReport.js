import mongoose from "mongoose";

// formal report to be written be head of user team (base for statistics)
const formalReportSchema = new mongoose.Schema({
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
    injuries: Number,
    casualties: Number,
    unitsDeployed: Number,
    comments : String,
    isOpen : {
        type : Boolean , required : true
    }
    // level??
});

module.exports = new mongoose.model("FormalReport", formalReportSchema);