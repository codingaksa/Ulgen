const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  createRole,
  getServerRoles,
  updateRole,
  deleteRole,
  assignRole,
  removeRole,
} = require("../controllers/roleController");

// Server'daki tüm rolleri getir
router.get("/server/:serverId", authenticateToken, getServerRoles);

// Role oluştur
router.post("/server/:serverId", authenticateToken, createRole);

// Role güncelle
router.put("/:roleId", authenticateToken, updateRole);

// Role sil
router.delete("/:roleId", authenticateToken, deleteRole);

// Kullanıcıya role ver
router.post("/assign/:serverId/:userId", authenticateToken, assignRole);

// Kullanıcıdan role al
router.delete("/remove/:serverId/:userId/:roleId", authenticateToken, removeRole);

module.exports = router;
