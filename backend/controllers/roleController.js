const Role = require("../models/Role");
const Server = require("../models/Server");

// Role oluştur
const createRole = async (req, res) => {
  try {
    const { name, color, permissions, position, mentionable, hoist } = req.body;
    const { serverId } = req.params;
    const userId = req.user.id;

    // Server'ın var olduğunu ve kullanıcının yetkili olduğunu kontrol et
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({
        success: false,
        message: "Server bulunamadı",
      });
    }

    // Kullanıcının server'da admin veya owner olduğunu kontrol et
    const member = server.members.find(m => m.user.toString() === userId);
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için yetkiniz yok",
      });
    }

    // Aynı isimde role var mı kontrol et
    const existingRole = await Role.findOne({ serverId, name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Bu isimde bir role zaten mevcut",
      });
    }

    // Varsayılan permissions
    const defaultPermissions = {
      viewChannels: true,
      sendMessages: true,
      embedLinks: true,
      attachFiles: true,
      readMessageHistory: true,
      useExternalEmojis: true,
      addReactions: true,
      connect: true,
      speak: true,
      useVoiceActivation: true,
      createInstantInvite: true,
      changeNickname: true,
      ...permissions,
    };

    const role = new Role({
      name,
      serverId,
      color: color || "#99AAB5",
      permissions: defaultPermissions,
      position: position || 0,
      mentionable: mentionable !== undefined ? mentionable : true,
      hoist: hoist !== undefined ? hoist : false,
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: "Role başarıyla oluşturuldu",
      role,
    });
  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// Server'daki tüm rolleri getir
const getServerRoles = async (req, res) => {
  try {
    const { serverId } = req.params;
    const userId = req.user.id;

    // Server'ın var olduğunu ve kullanıcının üye olduğunu kontrol et
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({
        success: false,
        message: "Server bulunamadı",
      });
    }

    const member = server.members.find(m => m.user.toString() === userId);
    if (!member) {
      return res.status(403).json({
        success: false,
        message: "Bu server'a erişim yetkiniz yok",
      });
    }

    const roles = await Role.find({ serverId }).sort({ position: -1 });

    res.json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error("Get server roles error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// Role güncelle
const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, color, permissions, position, mentionable, hoist } = req.body;
    const userId = req.user.id;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role bulunamadı",
      });
    }

    // Server'ı ve kullanıcının yetkisini kontrol et
    const server = await Server.findById(role.serverId);
    const member = server.members.find(m => m.user.toString() === userId);
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için yetkiniz yok",
      });
    }

    // Varsayılan role'ü güncellemeyi engelle
    if (role.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Varsayılan role güncellenemez",
      });
    }

    // Aynı isimde başka role var mı kontrol et
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ 
        serverId: role.serverId, 
        name, 
        _id: { $ne: roleId } 
      });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Bu isimde bir role zaten mevcut",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (color) updateData.color = color;
    if (permissions) updateData.permissions = { ...role.permissions, ...permissions };
    if (position !== undefined) updateData.position = position;
    if (mentionable !== undefined) updateData.mentionable = mentionable;
    if (hoist !== undefined) updateData.hoist = hoist;

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Role başarıyla güncellendi",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// Role sil
const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const userId = req.user.id;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role bulunamadı",
      });
    }

    // Server'ı ve kullanıcının yetkisini kontrol et
    const server = await Server.findById(role.serverId);
    const member = server.members.find(m => m.user.toString() === userId);
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için yetkiniz yok",
      });
    }

    // Varsayılan role'ü silmeyi engelle
    if (role.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Varsayılan role silinemez",
      });
    }

    // Server'daki tüm üyelerden bu role'ü kaldır
    await Server.updateMany(
      { _id: role.serverId },
      { $pull: { "members.$[].roles": roleId } }
    );

    await Role.findByIdAndDelete(roleId);

    res.json({
      success: true,
      message: "Role başarıyla silindi",
    });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// Kullanıcıya role ver
const assignRole = async (req, res) => {
  try {
    const { serverId, userId } = req.params;
    const { roleId } = req.body;
    const currentUserId = req.user.id;

    // Server'ı ve kullanıcının yetkisini kontrol et
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({
        success: false,
        message: "Server bulunamadı",
      });
    }

    const member = server.members.find(m => m.user.toString() === currentUserId);
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için yetkiniz yok",
      });
    }

    // Role'ün var olduğunu kontrol et
    const role = await Role.findById(roleId);
    if (!role || role.serverId.toString() !== serverId) {
      return res.status(404).json({
        success: false,
        message: "Role bulunamadı",
      });
    }

    // Hedef kullanıcının server'da olduğunu kontrol et
    const targetMember = server.members.find(m => m.user.toString() === userId);
    if (!targetMember) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bu server'da bulunamadı",
      });
    }

    // Role zaten atanmış mı kontrol et
    if (targetMember.roles.includes(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Bu role zaten atanmış",
      });
    }

    // Role'ü ata
    await Server.updateOne(
      { _id: serverId, "members.user": userId },
      { $addToSet: { "members.$.roles": roleId } }
    );

    res.json({
      success: true,
      message: "Role başarıyla atandı",
    });
  } catch (error) {
    console.error("Assign role error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// Kullanıcıdan role al
const removeRole = async (req, res) => {
  try {
    const { serverId, userId, roleId } = req.params;
    const currentUserId = req.user.id;

    // Server'ı ve kullanıcının yetkisini kontrol et
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({
        success: false,
        message: "Server bulunamadı",
      });
    }

    const member = server.members.find(m => m.user.toString() === currentUserId);
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için yetkiniz yok",
      });
    }

    // Role'ü kaldır
    await Server.updateOne(
      { _id: serverId, "members.user": userId },
      { $pull: { "members.$.roles": roleId } }
    );

    res.json({
      success: true,
      message: "Role başarıyla kaldırıldı",
    });
  } catch (error) {
    console.error("Remove role error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

module.exports = {
  createRole,
  getServerRoles,
  updateRole,
  deleteRole,
  assignRole,
  removeRole,
};
