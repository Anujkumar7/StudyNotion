const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

// ResetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
        // Get email from request body
        const email  = req.body;
        // Check user for the corresponding ermail/ email verification
        const user = await User.findOne({email: email});
        if(!user){
            return res.json({success: false, 
            message: "Your email is not registered with us"}); 
        }
        // Generate Token 
        const token = crypto.randomUUID();
        // Update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                        {email: email},
                                        {
                                            token: token,
                                            resetPasswordExpires: Date.now() + 5*60*1000, // 5 minutes
                                        },
                                        // returns the updated document in the response
                                        {new: true});
        // Create a url
        const url = `http://localhost:3000/update-password/${token}`;
        // Send email to user with the url
        await mailSender(email,
                        "Reset Password Link",
                        `Click on the link to reset your password: ${url}`);
        // Return success response
        return res.json({
            success: true,
            message: "Password reset link has been sent to your email",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password",
        });
    }


}

// ResetPassword
exports.resetPassword = async (req, res) => {
    try {
        //Data fetch
        const {password, confirmPassword, token} = req.body;

        // Validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }
        // Get user details form db using token
        const userDetails = await User.findOne({token: token});
        // If no entry-> Invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message: "Invalid token",
            });
        }
        // Also check token is expired or not
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token has expired",
            });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update password in db
        await User.findOneAndUpdate(
            {token: token},
            {
                password: hashedPassword,
            },
            {new: true}
        );
        // Send success response 
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password",
        });
    }
}