import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    role : String,
    agencyId: String,
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    isHeadOfAgency : {
        type : Boolean 
    },
    x : Number , 
    y : Number ,
    isAvailable : {
        type : Boolean 
    },
});
userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", userSchema);