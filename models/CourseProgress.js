const mongoose = require('mongoose');

const courseProgress = new mongoose.Schema({

    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subsection",
    }],

});

modeule.exports = mongoose.model("CourseProgress", courseProgress);