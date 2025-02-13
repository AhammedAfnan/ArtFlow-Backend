const multer = require("multer")
const sharp = require("sharp")
const Admin = require("../../models/admin/adminModel")
const User = require("../../models/user/userModel")
const Artist = require("../../models/artist/artistModel")
const cloudinary = require('../../util/cloudinary')

const multerStorage = multer.memoryStorage();

const multerFilter = (res, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null,true)
    }else{
        cb(new AppError("Not an image !, Please upload only Images,400"),false)
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
})

exports.uploadBannerImage = upload.single("banner")

exports.resizeBannerImage = async (req,res,next) => {
    const adminId = req.adminId;
    const admin = await Admin.findById({_id:adminId})

    try {
        if(!req.file) return next();
        req.file.filename = `admin-${admin.email}-${Date.now()}.jpeg`;
        req.body.bannerImage = req.file.filename;
        await sharp(req.file.buffer)
            .resize(1080,1080)
            .toFormat("jpeg")
            .toFile(`public/banners/${req.file.filename}`)
        next()
    } catch (error) {
        res.json({error:"error in resizing image"})
        console.log(error.message)
    }
}

exports.uploadUserProfile = upload.single("profile");

exports.resizeUserProfile = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
  
    try {
      if (!req.file) return next();
      req.file.filename = `user-${user.email}-${Date.now()}.jpeg`;
      req.body.userProfile = req.file.filename;
      await sharp(req.file.buffer)
        .resize(1080, 1080)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/userProfile/${req.file.filename}`);
      next();
    } catch (error) {
      res.json({ error: "error in resizing image" });
      console.log(error.message);
    }
  };

  exports.uploadArtistProfile = upload.single("profile");

exports.resizeArtistProfile = async (req, res, next) => {
  const artistId = req.artistId;
  const artist = await Artist.findById(artistId);

  try {
    if (!req.file) return next();
    
    req.file.filename = `artist-${artist.email}-${Date.now()}.jpeg`;
    req.body.artistProfile = req.file.filename;
    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/artistProfile/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};

exports.uploadArtistPost = upload.single("post");

exports.resizeArtistPost = async (req, res, next) => {
  try {
    if (!req.file) return next();

    // Process image with sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "artist-posts" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(processedImage)
      })

      req.body.artistPost = result.secure_url;
      next();
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return res.status(500).json({ error: "Image upload failed "})
  }
};