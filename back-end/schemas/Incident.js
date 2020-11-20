import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
    title : {
        type: String,required: true
    },
    x : {
        type: Number, required: true
    },
    y : {
        type: Number, required: true
    },
    startDate : {
        type: String, required: true
    },
    endDate : {
        type: String, required: true
    },
    telephone: {
        type: String, required: true
    },      //tel of caller
    level: {
        type: Object, required: true     //object of <agency:level> pairs
    },
    isOpen : {
       type : Boolean
    },
    userId : { //coordinator
        type : String , required : true
    },
    users :{
        type : Object                   // object of <agency:user array> pairs
    }

});

module.exports = new mongoose.model("Incident", incidentSchema);