const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {default : mongoose} = require("mongoose");


// Capture the payment and initate the Raorpay order
exports.capturePayment = async (req, res) => {

    // get course id and user id from request body
    const {course_id} = req.body;
    const userId = req.user.id;
    // validation
    // valid course id
    if(!course_id){
        return res.json({
            success: false,
            message: "Please provide valid course id.",
        })
    };
    // valid course details
    let course;
    try{
        // course ka data mil gaya
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success: false,
                message: "Course not found.",
            })
        };

        // User already paid for the same course or not
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.json({
                success: false,
                message: "You have already enrolled for this course.",
            });
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching course details.",
        })
    }
    // Order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency: currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            course_id: course_id,
            user_id: userId,
        },
    };

    try{
        // initiate the payment using razor pay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        // Return response
        return res.status(200).json({
            success: true,
            message: "Order created successfully.",
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    }
    catch(error){
        console.error(error);
        return res.json({
            success: false,
            message: "Something went wrong while creating order.",
        })
    }
};
// Verify Signature of razor pay and server
//  i have to match the server generated signature with the razor pay generated signature
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    // razorpay wala signature
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    // now we have to match the digest with the signature
    if(signature === digest){
        console.log("Payment verified successfully.");

        const {course_id, user_id} = req.body.payload.payment.entity.notes;

        try{
            // Fulfill the action
            
            // Find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                            {_id: course_id},
                                            {$push: {studentsEnrolled: user_id}},
                                            {new: true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course not found.",
                });
            } 
            console.log(enrolledCourse);

            // Find the student and add the course to his enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                                            {_id: user_id},
                                            {$push:{courses:courseId}},
                                            {new: true},
            );

            console.log(enrolledStudent);

            // send the confirmation mail to the student
            const emailResponse = await mailSender(
                                    enrolledStudent.email,
                                    "Congratulations from CodeHelp",
                                    "Congratulations, you are onboarded into new CodeHelp Course.",
            ); 
            consople.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully and course enrolled.",
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error in enrolling course.",
            });
        }
    }

    else{
        return res.status(400).json({
            success: false,
            message: "Invalid signature.",
        });
    }

}

