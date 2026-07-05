const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//send connection request
requestRouter.post(
  "/request/send/{:status}/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req?.user?._id;
      const toUserId = req?.params?.toUserId;
      const status = req?.params?.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type." + status);
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User does not exist.");
      }

      //if there is an existing ConnectionRequest between the two users, update the status instead of creating a new one
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists.");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.json({
        message:
          req?.user.firstName + " is " + status + " in " + toUser?.firstName,
        connectionRequest,
      });
    } catch (err) {
      res.status(400).send("Something went wrong! " + err.message);
    }
  },
);

module.exports = requestRouter;
