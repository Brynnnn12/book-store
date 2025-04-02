const cloudinary = require("cloudinary").v2;

exports.extractPublicId = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) return null;

  try {
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload") + 1;
    const publicIdWithVersion = urlParts.slice(uploadIndex).join("/");
    return publicIdWithVersion.split(".")[0].replace(/^v\d+\//, "");
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};

exports.deleteImage = async (publicId) => {
  if (!publicId) return { result: "no public_id provided" };

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    return { result: "error", error };
  }
};
