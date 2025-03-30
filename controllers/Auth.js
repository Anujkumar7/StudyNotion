const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// send OTP
exports.sendOTP = async (req, res) => {

    try{
        // Fetch email from req ki body
        const {email} = req.body;

        // Check if user exists
        const checkUserPresent = await User.findOne({email});

        //If user already exists, then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message: "User already exists",
            })
        }
        // Generate OTP
        var otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false, 
            lowerCaseAlphabets: false, 
            specialChars: false,
        });
        console.log("OTP Generated", otp);

        // Making sure the otp is generated is unique or not
        let result = await OTP.findOne({otp: otp});        

        // agar upar wali line ke corresponding koi result nahi milta that means it is unique
        while(result){
            otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                lowerCaseAlphabets: false, 
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayLoad = {email, otp};

        // Create an entry in db
        const otpBody = await OTP.create(otpPayLoad);
        console.log("OTP Created", otpBody);

        // Return success response
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.statis(500).json({
            success: false,
            message: error.message,
        })
    }

};

// SignUp
exports.signUp = async (req, res) => {
    
    try{
        // Data fetch from req ki body
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,        
        } = req.body;
        // validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details",
            })
        }
        // Dono password match krlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            })
        }

        // Check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: 'User is already registered',
            });
        }
        // Find most recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);

        // Validate OTP
        if(recentOtp.length == 0){
            // OTP not found
            return res.status(400).json({
                sucess:false,
                message: "OTP not found",
            })
        } else if(otp !== recentOtp.otp){
            // Invalid OTP
            return res.statuis(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash the password (Using Bcrypt library)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Entry create in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails : profileDetails._id,
            image:  `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        // return response
        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, Please try again",
        });
    }

}

// Login
exports.login = async (req, res) => {
    try{
        // Get data from req ki body
        const { email, password } = req.body; 
        // Validate data
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please enter both email and password",
            });
        } 
        // User check if exists or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found, Please signup first",
            });
        }
        // Generate JWT token, after password match
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h',
            });
            user.token = token;
            user.password = undefined;
            
            // Create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully", 
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure, Please try again",
        });
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    // Get data from req ki body 
    // Get Old password, newPassword, confirmPassword
    // Validation

    // Update pwd in DB
    // Send mail- Password Updated
    // Return response
}