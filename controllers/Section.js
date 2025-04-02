const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async (req, res) =>{
    try{
        // Data fetch
        const {sectionNmae, courseId} = req.ody;
        // Data validation
        if(!sectionNmae || !courseId){
            return res.status(400).json({
                success:false,
                message: "Please fill all fields."});
        }
        // Create Section
        const newSection = await Section.create({sectionName});
        // Update Course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push: {
                                                    sections: newSection._id,
                                                }
                                        },
                                        // Taki humein updated doc mile purana naa mile thats why new : true 
                                        { new: true }
                                    );
        // Use populate to generate sections and subsection both in the updatedCourseDetails
        // Return response
        return res.status(201).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again later",
            error: error.message
        });
    }
}

exports.updateSection = async (req, res) =>{
    try{
        // Data Input
        const {sectionId, sectionName} = req.body;
        // Data validation
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message: "Please fill all fields."});
            }
        // Update Data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});
        // Return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again later",
            error: error.message
        });
    }
};


exports.deleteSection = async (req, res) =>{
    try{
        //get id -> assuming  that we are sendiing IO in params
        const {sectionId} = req.params;
        // Use findbyidanddelete
        await Section.findByIdAndDelete(sectionId);
        // TODO[Testing]: Do we need to delete the entry from course schema too?
        // return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again later",
            error: error.message
        });
    }
}


