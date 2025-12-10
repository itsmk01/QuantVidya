const cloudinary = require("cloudinary").v2;


exports.uploadImageToCloudinary = async (file ,folder ,height ,quality) => {
    try{
        const options = {folder};
        if(height){
            options.height = height;
        }
        if(quality){
            options.quality = quality;
        }
        options.resource_type = "auto";

        //returns a response object that contains multiple details about the uploaded file
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    }
    catch(err){
        console.log(err);
    }
}

// Upload video to Cloudinary
exports.uploadVideoToCloudinary = async (file, folder, quality = "auto") => {
  const options = {
    folder,
    resource_type: "video",
    quality: quality,
    chunk_size: 6000000, // 6MB chunks for large files
  };
  
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.deleteImageFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("Error deleting image from Cloudinary:", error);
        throw error;
    }
}


exports.deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error);
    throw error;
  }
};