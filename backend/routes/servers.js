// routes/servers.js
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
  setMemberRole,
} = require("../controllers/serverController");

/* ================== Protected (all require auth) ================== */
router.use(authenticateToken);

/* ---------- Servers ---------- */
// GET   /api/servers                  -> kullanıcının sunucularını listeler
// POST  /api/servers                  -> yeni sunucu oluşturur
router.route("/").get(listServers).post(createServer);

// PUT   /api/servers/:serverId        -> sunucu ayarları (ad, ikon) güncelle
// DELETE /api/servers/:serverId       -> sunucuyu sil (owner)
router.route("/:serverId").put(updateServer).delete(deleteServer);

// POST  /api/servers/:serverId/sync-channels -> tüm üyeleri tüm kanallara ekle (migration helper)
router.post("/:serverId/sync-channels", syncChannelMembers);

/* ---------- Channels in a Server ---------- */
// GET   /api/servers/:serverId/channels             -> sunucunun kanallarını listeler (member olanlar)
// POST  /api/servers/:serverId/channels             -> sunucuda kanal oluştur (owner)
router.route("/:serverId/channels").get(listChannels).post(createChannel);

// PUT   /api/servers/:serverId/channels/:channelId  -> kanalı güncelle (owner)
// DELETE/…                                           -> kanalı sil (owner)
router
  .route("/:serverId/channels/:channelId")
  .put(updateChannel)
  .delete(deleteChannel);

// Set member role (owner only)
router.put("/:serverId/members/:userId/role", setMemberRole);

module.exports = router;
