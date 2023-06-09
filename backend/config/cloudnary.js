require('dotenv').config()

const cloudinary = require('cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
    api_key: process.env.CLOUDNARY_API_KEY, 
    api_secret: process.env.CLOUDNARY_API_SECRET,
    secure: true
  });
  


  const uploadToCloudinary = (path , folder) => {

    return cloudinary.v2.uploader.upload(path , {folder})
    .then((data) => {
        return {url : data.url , public_id : data.public_id}
    })
    .catch((error) => {
        console.log(error);
    })

}


const removeFromCloudinary = async (public_id) => {
    await cloudinary.v2.uploader.destroy(public_id , (error , result) => {
        console.log(result , error);
    })
}

module.exports = {uploadToCloudinary , removeFromCloudinary}