const Role = require("../models/Role");
const Server = require("../models/Server");

/**
 * Kullanıcının belirli bir permission'a sahip olup olmadığını kontrol eder
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} serverId - Server ID'si
 * @param {string} permission - Kontrol edilecek permission
 * @returns {Promise<boolean>} - Permission var mı?
 */
const hasPermission = async (userId, serverId, permission) => {
  try {
    // Server'ı ve kullanıcının üyelik bilgilerini al
    const server = await Server.findById(serverId).populate('members.user');
    if (!server) return false;

    const member = server.members.find(m => m.user._id.toString() === userId);
    if (!member) return false;

    // Owner her zaman tüm permission'lara sahip
    if (member.role === 'owner') return true;

    // Admin'ler çoğu permission'a sahip (administrator permission'ı hariç)
    if (member.role === 'admin' && permission !== 'administrator') return true;

    // Kullanıcının rolleri varsa, rolleri kontrol et
    if (member.roles && member.roles.length > 0) {
      const roles = await Role.find({ _id: { $in: member.roles } });
      
      for (const role of roles) {
        if (role.hasPermission(permission)) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
};

/**
 * Kullanıcının belirli bir role'ü yönetip yönetemeyeceğini kontrol eder
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} serverId - Server ID'si
 * @param {string} targetRoleId - Hedef role ID'si
 * @returns {Promise<boolean>} - Role yönetebilir mi?
 */
const canManageRole = async (userId, serverId, targetRoleId) => {
  try {
    const server = await Server.findById(serverId);
    if (!server) return false;

    const member = server.members.find(m => m.user.toString() === userId);
    if (!member) return false;

    // Owner her zaman role yönetebilir
    if (member.role === 'owner') return true;

    // Admin'ler sadece kendi pozisyonlarından düşük role'leri yönetebilir
    if (member.role === 'admin') {
      const targetRole = await Role.findById(targetRoleId);
      if (!targetRole) return false;

      // Kullanıcının en yüksek role pozisyonunu bul
      if (member.roles && member.roles.length > 0) {
        const userRoles = await Role.find({ _id: { $in: member.roles } });
        const maxUserPosition = Math.max(...userRoles.map(r => r.position));
        return maxUserPosition > targetRole.position;
      }
    }

    return false;
  } catch (error) {
    console.error("Can manage role check error:", error);
    return false;
  }
};

/**
 * Kullanıcının belirli bir kullanıcıyı yönetip yönetemeyeceğini kontrol eder
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} serverId - Server ID'si
 * @param {string} targetUserId - Hedef kullanıcı ID'si
 * @returns {Promise<boolean>} - Kullanıcı yönetebilir mi?
 */
const canManageUser = async (userId, serverId, targetUserId) => {
  try {
    const server = await Server.findById(serverId);
    if (!server) return false;

    const member = server.members.find(m => m.user.toString() === userId);
    const targetMember = server.members.find(m => m.user.toString() === targetUserId);
    
    if (!member || !targetMember) return false;

    // Owner her zaman kullanıcı yönetebilir
    if (member.role === 'owner') return true;

    // Admin'ler sadece member'ları yönetebilir
    if (member.role === 'admin' && targetMember.role === 'member') return true;

    // Role pozisyonu kontrolü
    if (member.roles && member.roles.length > 0 && targetMember.roles && targetMember.roles.length > 0) {
      const userRoles = await Role.find({ _id: { $in: member.roles } });
      const targetRoles = await Role.find({ _id: { $in: targetMember.roles } });
      
      const maxUserPosition = Math.max(...userRoles.map(r => r.position));
      const maxTargetPosition = Math.max(...targetRoles.map(r => r.position));
      
      return maxUserPosition > maxTargetPosition;
    }

    return false;
  } catch (error) {
    console.error("Can manage user check error:", error);
    return false;
  }
};

/**
 * Kullanıcının belirli bir channel'ı yönetip yönetemeyeceğini kontrol eder
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} serverId - Server ID'si
 * @param {string} channelId - Channel ID'si
 * @returns {Promise<boolean>} - Channel yönetebilir mi?
 */
const canManageChannel = async (userId, serverId, channelId) => {
  try {
    // Server'da manageChannels permission'ı var mı kontrol et
    return await hasPermission(userId, serverId, 'manageChannels');
  } catch (error) {
    console.error("Can manage channel check error:", error);
    return false;
  }
};

/**
 * Kullanıcının belirli bir mesajı yönetip yönetemeyeceğini kontrol eder
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} serverId - Server ID'si
 * @param {string} messageUserId - Mesaj sahibi ID'si
 * @returns {Promise<boolean>} - Mesaj yönetebilir mi?
 */
const canManageMessage = async (userId, serverId, messageUserId) => {
  try {
    // Kendi mesajını yönetebilir
    if (userId === messageUserId) return true;

    // manageMessages permission'ı var mı kontrol et
    return await hasPermission(userId, serverId, 'manageMessages');
  } catch (error) {
    console.error("Can manage message check error:", error);
    return false;
  }
};

module.exports = {
  hasPermission,
  canManageRole,
  canManageUser,
  canManageChannel,
  canManageMessage,
};
