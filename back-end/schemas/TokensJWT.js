import mongoose from "mongoose";

const tokenJWTSchema =new mongoose.Schema({
    mytoken: {
        type: String,
        required: true
    }
    
},{timestamps: true});

tokenJWTSchema.index({createdAt: 1},{expireAfterSeconds: 3600});


module.exports = new mongoose.model("TokenJWT", tokenJWTSchema);