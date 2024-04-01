const express = require("express"),
   artistRouter = express.Router(),
   artistController = require("../controllers/artistController"),
   artistAuthMiddleware = require("../middlewares/Auth/artistAuth"),
   upload = require("../middlewares/imageUpload/cropImage"),
   chatController = require("../controllers/chatController")


artistRouter
    .post("/artistRegister",artistController.register)
    .get('/getCategories',artistController.getCategories)
    .post('/artistOtp',artistController.verifyOtp)
    .post('/artistResendOtp',artistController.ResendOtp)
    .post('/artistVerifyLogin',artistController.verifyLogin)
    .post("/artistVerifyEmail", artistController.forgetVerifyEmail)
    .post("/artistUpdatePassword", artistController.updatePassword)
    .get(
      "/getPlansAvailable",
      artistAuthMiddleware,
      artistController.getPlansAvailable
    )
    .post(
      "/subscribePlan",
      artistAuthMiddleware,
      artistController.subscriptionPayment
    )
    .post(
        "/editArtistProfile",
        artistAuthMiddleware,
        upload.uploadArtistProfile,
        upload.resizeArtistProfile,
        artistController.editArtistProfile
      )
      .post(
        "/uploadPost",
        artistAuthMiddleware,
        upload.uploadArtistPost,
        upload.resizeArtistPost,
        artistController.uploadPost
      )
      .get("/getMyPosts", artistAuthMiddleware, artistController.getMyPosts)
      .post(
        "/deletePost",
        artistAuthMiddleware,
        artistController.deletePost
      )
      .get(
        "/checkArtistBlocked",
        artistAuthMiddleware,
        artistController.checkCurrentArtistBlocked
      )
      .post(
        "/getPostComments",
        artistAuthMiddleware,
        artistController.getPostComments
      )
      .post(
        "/subscribePlan",
        artistAuthMiddleware,
        artistController.subscriptionPayment
      )
      .get(
        "/successPayment",
        artistController.showSuccessPage
      )
      .get("/errorPayment", artistController.showErrorPage)

  // notifications 

  .get(
    "/getArtistNotifications",
    artistAuthMiddleware,
    artistController.getArtistNotifications
  )

  .delete(
    "/deleteNotification",
    artistAuthMiddleware,
    artistController.deleteNotification
  )

  .delete(
    "/clearArtistAllNotifications",
    artistAuthMiddleware,
    artistController.clearAllNotification
  )

  .get(
    "/getMySubscriptions",
    artistAuthMiddleware,
    artistController.getMySubscriptions
  )
  .get(
    "/getFollowersInArtistSide",
    artistAuthMiddleware,
    artistController.getArtistFollowers
  )

  .get(
    "/getArtistNotificationCount",
    artistAuthMiddleware,
    artistController.getNotificationCount
  )

  .get(
    "/getArtistBanners",
    artistAuthMiddleware,
    artistController.getArtistBanners
  )

  .post(
    "/replyUserComment",
    artistAuthMiddleware,
    artistController.replyUserComment
  )
  .post("/deleteReply", artistAuthMiddleware, artistController.deleteReply)

  //chat
  .get(
    "/getAllMessagedUsers",
    artistAuthMiddleware,
    chatController.getUserChatList
  )

  .post(
    "/getPrevMessages",
    artistAuthMiddleware,
    chatController.artistGetRoom
  )

  .post(
    "/sendArtistNewMsg",
    artistAuthMiddleware,
    chatController.artistNewMessage
  )
  
module.exports = artistRouter;
