const Profile = require('../models/Profile');
const User = require('../models/User');


exports.updateProfile = async (req, res) => {
    try {
        // Get data
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;
        // Get user ID
        const id = req.user.id;
        // Validate data
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields.",
            });
        }
        // Find profile 
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        // New way of saving data in MongoDB without using create function we use save function
        // when we kbnow that the object is already created in the db and we just need to update it
        // and not create a new one so we use .save() function
        await profileDetails.save();
        // Rerturn response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            profileDetails,
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Delete profile account
// Explore-> how can we schedule this deletion operation 
exports.deleteAccount = async (req, res) => {
    try{
        // Get id
        const id = req.user.id;
        // Validate data
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message: "User not found.",
            });
        }
        // Delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // TODO: unenroll uyser from all enrolled courses
        // Delete user
        await User.findByIdAndDelete({_id:id});
        // Return response
        return res.status(200).json({
            success:true,
            message: "Account deleted successfully.",
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// To get all user details
exports.getAllUserDetails = async (req, res) => {
    try{
        // Get id
        const id = req.user.id;
        // Validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails");
        
        // return res
         return res.status(200).json({
            success:true,
            message: "User details fetched successfully.",
            userDetails,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: error.message ,
        });
    }
};