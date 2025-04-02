const Subsection = require("../models/SubSection"); 
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create subsection

exports.createSubSection = async (req, res) => {
    try{
        // Fetch data from request body
        const {sectionId, title, timeDuration, description } = req.body;
        // Extract file/Video
        const video = req.files.videoFile;
        // Perform validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message: "Please fill all fields.",
            });
        }
        // We basically need url in the subsection, not the actual video hence we'll upload that video to cloudinary 
        // after uploading we'll get secured link 
        const uploadDetails =  await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // uploadDetails ke andar secured url aagya hoga

        // Create a subsection
        const subSectionDetails = await Subsection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        // Update section wit this subsection object Id
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                    {$push:{
                                                        subSection:subSectionDetails._id,
                                                    }},
                                                    {new:true});
        // HW log updated section here, after adding populate query
        // Return response  
        return res.status(200).json({
            success:true,
            message: "Subsection created successfully.",
            updatedSection
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            error: error.message
        })
    }
}