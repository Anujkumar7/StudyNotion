const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');


// CreateRating
exports.createRating = async (req, res) => {
    try{
        // Get user id
        const userId = req.user.id;
        // Fetch date from req body
        const {courseId, rating, review} = req.body;
        // Check if user is enrolled or not
        const courseDeetails = await Course.findOne(
                                        {_id:courseId,
                                            // NEW parameter (element and equal to)
                                            studentsEnrolled: {$elemMatch:{$eq:userId} }
                                        });
        if(!courseDeetails){
            return res.status(404).json({
                success: false,
                message: "You are not enrolled in this course."
            })
        }
        // Check if user already rated or not
        const alreadyReviewd = await RatingAndReview.findOne({
                                            user:userId,
                                            course:courseId,
                                        });
        if(alreadyReviewd){
            return res.status(403).json({
                success: false,
                message: "You have already rated this course."
            });
        }
        // Create rating and review
        const ratingAndReview = await RatingAndReview.create({
                                        rating, review,
                                        user:userId,
                                        course:courseId,
                                    });

        // update course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id : courseId},
                                    {
                                        $push:{
                                            ratingAndReviews:ratingAndReview._id,
                                        }
                                    },
                                    {new:true});
        console.log(updatedCourseDetails); 
        // return response
        return res.status(200).json({
        success: true,
        message: "Rating and Review Added Successfully",    
        ratingAndReview,
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message, 
        });
    }

}

// GetAverageRating
exports.getAverageRating = async (req, res) => {
    try{
        // get course id
        const {courseId} = req.body.courseId;
        // Calculate average rating
        const result = await RatingAndReview.aggregate([
            { 
                $match: {
                     course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            }
        ])

        // return rating
        if(result.length > 0){

            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // if no rating and review exist
        return res.status(200).json({
            success: true,
            averageRating: 0,
        });
    }

    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// GetAllRatingAndReview
exports.getAllRatingAndReview = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName",
                                })
                                .exec();
        // return response
        return res.status(200).json({
            success: true,
            message: "All Ratings and Reviews Fetched Successfully",
            data: allReviews,
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
