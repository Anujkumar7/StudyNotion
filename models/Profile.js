const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender : {
        type: String,
    },
    dateOfBirth : {
        type: Date,
    },
    about : {
        type: String,
        trim:true,
    },
    contactNumber : {
        type: String,
        trim:true,
    },
});

modeule.exports = mongoose.model("Profile", profileSchema);