// routes/channel.js
const express = require('express');
const router = express.Router();

const {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  joinChannel,
  leaveChannel,
} = require('../controllers/channelController');

const { authenticateToken } = require('../middleware/auth');

/* ================== Protected Routes ================== */
// Tüm channel işlemleri kimlik doğrulaması gerektirir
router.use(authenticateToken);

/* ---------- Kanal listesi & oluşturma ---------- */
// GET /api/channels           -> kullanıcının kanalları listeler
// POST /api/channels          -> yeni kanal oluşturur
router
  .route('/')
  .get(getChannels)
  .post(createChannel);

/* ---------- Tekil kanal işlemleri ---------- */
// GET /api/channels/:id       -> kanal detaylarını getirir
// PUT /api/channels/:id       -> kanal bilgilerini günceller
// DELETE /api/channels/:id    -> kanalı siler
router
  .route('/:id')
  .get(getChannel)
  .put(updateChannel)
  .delete(deleteChannel);

/* ---------- Üyelik işlemleri ---------- */
// POST /api/channels/:id/join  -> kanala katıl
// POST /api/channels/:id/leave -> kanaldan ayrıl
router.post('/:id/join', joinChannel);
router.post('/:id/leave', leaveChannel);

module.exports = router;
