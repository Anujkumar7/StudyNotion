const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (File, folder, height, quality) => {
    const options = {folder};
    if (height){
        options.height = height;
    }
    if (quality){
        options.quality = quality;
    }
    options.resource_type = 'auto'; // Automatically determine the resource type based on the file type

    return await cloudinary.uploader.upload(file.tempFilePath , options); 
}