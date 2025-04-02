const Course = require('../models/Course');
const Tag = require('../models/Tag');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// Create course ka handler function
exports.createCourse = async (req, res) => {
    try{
        
        // Fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tags} = req.body;

        // Get thumbnail from req
        const thumbnail = req.files.thumbnailImage;

        // Validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details",
            });
        }

        // Check if user is instructor or not 
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details", instructorDetails);
        // TODO: verify that userid and instructorDetails._id are same or not

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

        // Check the given tag is valid or not
        const tagDetails = await Tag.findById(tags); 
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: "Tag details not found",
            });
        }

        // Upload thumbnail to cloudinary
        const thumbnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an Entry for new course
        const newCourse = new Course({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        // add the new course to the user schema of the instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    // Course ki id mei new course jo create kra hai uski id dal do 
                    courses: newCourse._id
                },
            },
            {new: true},
        );

        // Update the tag schema

        // return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            course: newCourse,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create course',
            error: error.message,
        });
    } 
}

// Get all courses ka handler function

exports.showAllCourses = async (req, res) => {
    try {
        // TODO change the below statement incremently
        const allCourses = await Course.find({});
        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: allCourses, 
        });
        

    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message,
        });
    }
}