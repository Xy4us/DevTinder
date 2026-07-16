const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const UserModel = require("../models/user");
const userRouter = express.Router();

const userSafeData = "firstName lastName photoUrl about skills gender age";

//get all the pending connection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const connectioRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", userSafeData);

    res.json({
      message: "Connection requests fetched successfully!",
      connectioRequests,
    });
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong! " + err.message,
    });
  }
});

//api too get the user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser?._id, status: "accepted" },
        { toUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({
      message: "Connections fetched successfully!",
      connections: data,
    });
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong! " + err.message,
    });
  }
});

//feed api (browse everyone)
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // User should see all the other users cards except
    // his own card
    // his connections
    // ignored peoples
    // rejected peoples
    // already sent the connection request

    const loggedInUser = req?.user;

    const page = parseInt(req?.query?.page) || 1;
    let limit = parseInt(req?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    limit = limit > 50 ? 50 : limit;

    //find all the connection req that either i have sent or received
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
    }).select("fromUserId toUserId status");

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const feed = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser?._id } },
      ],
    })
      .select(userSafeData)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Feed fetched successfully!",
      feed,
    });
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong! " + err.message,
    });
  }
});

module.exports = userRouter;
