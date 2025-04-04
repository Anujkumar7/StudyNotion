const { response } = require("express");
const Tag = require("../models/Tag");

// Create tag ka handler function
exports.createTag = async (req, res) => {
    try{
        // Fetch data
        const {name, description} = req.body;
        // Validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Please provide name and description",
            });
        }
        // Create tag in db
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });
        console.log(tagDetails);
        
        // return response
        return res.status(200).json({
            success: true,
            message: "Tag created successfully", 
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// getAlltags handler functiom

exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, {name: true, description: true});
        res.status(200).json({
            success: true,
            message: "All tags fetched successfully",
            allTags, 
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};