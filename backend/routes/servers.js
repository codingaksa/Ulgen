const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  listServers,
  createServer,
  listChannels,
  createChannel,
  syncChannelMembers,
  deleteServer,
  updateServer,
  updateChannel,
  deleteChannel,
} = require("../controllers/serverController");

router.get("/", authenticateToken, listServers);
router.post("/", authenticateToken, createServer);
router.get("/:serverId/channels", authenticateToken, listChannels);
router.post("/:serverId/channels", authenticateToken, createChannel);
router.post("/:serverId/sync-channels", authenticateToken, syncChannelMembers);
router.delete("/:serverId", authenticateToken, deleteServer);
router.put("/:serverId", authenticateToken, updateServer);
router.put("/:serverId/channels/:channelId", authenticateToken, updateChannel);
router.delete(
  "/:serverId/channels/:channelId",
  authenticateToken,
  deleteChannel
);

module.exports = router;
