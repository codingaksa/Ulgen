const express = require('express');
const router = express.Router();
const {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  joinChannel,
  leaveChannel
} = require('../controllers/channelController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

// Channel routes
router.route('/')
  .get(getChannels)
  .post(createChannel);

router.route('/:id')
  .get(getChannel)
  .put(updateChannel)
  .delete(deleteChannel);

router.post('/:id/join', joinChannel);
router.post('/:id/leave', leaveChannel);

module.exports = router;
