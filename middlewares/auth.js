const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require('../models/User');


// Auth
exports.auth = async(req, res, next) => {
    try{
        // Extracttoken
        const token = req.cookies.token
                        || req.body.token
                        || req.header("Authorisation").replace("Bearer ", "");
        
        // If token is missing, return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            });
        }

        // Verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decode", decode);
            req.user = decode; 
        }
        catch(error){
            // Verification issue
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating token",
        }); 
    }
}

// isStudent
exports.isStudent = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is not a protected route for Student only",
            });
        }
        next();
    }
    catch(error){
         return res.status(500).json({
            success: false,
            message: "Usr role cannot be verified",
        });
    }
}

// isInstructor
exports.isInstructor = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is not a protected route for Instructor only",
            });
        }
        next();
    }
    catch(error){
         return res.status(500).json({
            success: false,
            message: "Usr role cannot be verified",
        });
    }
}

// isAdmin
exports.isAdmin = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is not a protected route for Admin only",
            });
        }
        next();
    }
    catch(error){
         return res.status(500).json({
            success: false,
            message: "Usr role cannot be verified",
        });
    }
}