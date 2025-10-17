import React, { useState, useEffect } from "react";
import { useUserStatus } from "../contexts/UserStatusContext";

interface Role {
  _id: string;
  name: string;
  color: string;
  permissions: {
    [key: string]: boolean;
  };
  position: number;
  mentionable: boolean;
  hoist: boolean;
  isDefault: boolean;
}

interface RoleManagementProps {
  serverId: string;
  className?: string;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ 
  serverId, 
  className = "" 
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    color: "#99AAB5",
    permissions: {
      manageServer: false,
      manageRoles: false,
      manageChannels: false,
      manageMembers: false,
      viewAuditLog: false,
      viewChannels: true,
      sendMessages: true,
      manageMessages: false,
      embedLinks: true,
      attachFiles: true,
      readMessageHistory: true,
      mentionEveryone: false,
      useExternalEmojis: true,
      addReactions: true,
      connect: true,
      speak: true,
      muteMembers: false,
      deafenMembers: false,
      moveMembers: false,
      useVoiceActivation: true,
      prioritySpeaker: false,
      administrator: false,
      createInstantInvite: true,
      changeNickname: true,
      manageNicknames: false,
      kickMembers: false,
      banMembers: false,
    },
    position: 0,
    mentionable: true,
    hoist: false,
  });

  // Rolleri yükle
  const loadRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/roles/server/${serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles);
      }
    } catch (error) {
      console.error("Load roles error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen, serverId]);

  // Role oluştur
  const createRole = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/roles/server/${serverId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadRoles();
        setShowCreateForm(false);
        resetForm();
      }
    } catch (error) {
      console.error("Create role error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Role güncelle
  const updateRole = async () => {
    if (!editingRole) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/roles/${editingRole._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadRoles();
        setEditingRole(null);
        resetForm();
      }
    } catch (error) {
      console.error("Update role error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Role sil
  const deleteRole = async (roleId: string) => {
    if (!confirm("Bu role'ü silmek istediğinizden emin misiniz?")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/roles/${roleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadRoles();
      }
    } catch (error) {
      console.error("Delete role error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      color: "#99AAB5",
      permissions: {
        manageServer: false,
        manageRoles: false,
        manageChannels: false,
        manageMembers: false,
        viewAuditLog: false,
        viewChannels: true,
        sendMessages: true,
        manageMessages: false,
        embedLinks: true,
        attachFiles: true,
        readMessageHistory: true,
        mentionEveryone: false,
        useExternalEmojis: true,
        addReactions: true,
        connect: true,
        speak: true,
        muteMembers: false,
        deafenMembers: false,
        moveMembers: false,
        useVoiceActivation: true,
        prioritySpeaker: false,
        administrator: false,
        createInstantInvite: true,
        changeNickname: true,
        manageNicknames: false,
        kickMembers: false,
        banMembers: false,
      },
      position: 0,
      mentionable: true,
      hoist: false,
    });
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      color: role.color,
      permissions: role.permissions,
      position: role.position,
      mentionable: role.mentionable,
      hoist: role.hoist,
    });
    setShowCreateForm(true);
  };

  const handleSubmit = () => {
    if (editingRole) {
      updateRole();
    } else {
      createRole();
    }
  };

  const permissionGroups = [
    {
      title: "Sunucu İzinleri",
      permissions: [
        { key: "manageServer", label: "Sunucuyu Yönet" },
        { key: "manageRoles", label: "Rolleri Yönet" },
        { key: "manageChannels", label: "Kanalları Yönet" },
        { key: "manageMembers", label: "Üyeleri Yönet" },
        { key: "viewAuditLog", label: "Denetim Günlüğünü Görüntüle" },
      ],
    },
    {
      title: "Kanal İzinleri",
      permissions: [
        { key: "viewChannels", label: "Kanalları Görüntüle" },
        { key: "sendMessages", label: "Mesaj Gönder" },
        { key: "manageMessages", label: "Mesajları Yönet" },
        { key: "embedLinks", label: "Bağlantıları Göm" },
        { key: "attachFiles", label: "Dosya Ekle" },
        { key: "readMessageHistory", label: "Mesaj Geçmişini Oku" },
        { key: "mentionEveryone", label: "@everyone Kullan" },
        { key: "useExternalEmojis", label: "Harici Emojiler Kullan" },
        { key: "addReactions", label: "Tepki Ekle" },
      ],
    },
    {
      title: "Ses İzinleri",
      permissions: [
        { key: "connect", label: "Bağlan" },
        { key: "speak", label: "Konuş" },
        { key: "muteMembers", label: "Üyeleri Sessize Al" },
        { key: "deafenMembers", label: "Üyeleri Sağırlaştır" },
        { key: "moveMembers", label: "Üyeleri Taşı" },
        { key: "useVoiceActivation", label: "Ses Aktivasyonu Kullan" },
        { key: "prioritySpeaker", label: "Öncelikli Konuşmacı" },
      ],
    },
    {
      title: "Gelişmiş İzinler",
      permissions: [
        { key: "administrator", label: "Yönetici" },
        { key: "createInstantInvite", label: "Anlık Davet Oluştur" },
        { key: "changeNickname", label: "Takma Ad Değiştir" },
        { key: "manageNicknames", label: "Takma Adları Yönet" },
        { key: "kickMembers", label: "Üyeleri At" },
        { key: "banMembers", label: "Üyeleri Yasakla" },
      ],
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-[#1F1B24] hover:bg-[#2A2530] rounded-lg transition-colors"
      >
        <span className="text-white text-sm">Roller</span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-[#1F1B24] border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Roller</h3>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingRole(null);
                  resetForm();
                }}
                className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors"
              >
                Yeni Role
              </button>
            </div>

            {showCreateForm && (
              <div className="mb-4 p-4 bg-[#121212] rounded-lg">
                <h4 className="text-white font-medium mb-3">
                  {editingRole ? "Role Düzenle" : "Yeni Role Oluştur"}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Role Adı</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1F1B24] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Role adı..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Renk</label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-10 rounded-lg border border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    {permissionGroups.map((group) => (
                      <div key={group.title}>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">{group.title}</h5>
                        <div className="space-y-1">
                          {group.permissions.map((permission) => (
                            <label key={permission.key} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.permissions[permission.key as keyof typeof formData.permissions]}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  permissions: {
                                    ...formData.permissions,
                                    [permission.key]: e.target.checked,
                                  },
                                })}
                                className="w-4 h-4 text-violet-600 bg-[#1F1B24] border-gray-600 rounded focus:ring-violet-500"
                              />
                              <span className="text-sm text-gray-300">{permission.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                    >
                      {loading ? "Kaydediliyor..." : editingRole ? "Güncelle" : "Oluştur"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingRole(null);
                        resetForm();
                      }}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {roles.map((role) => (
                <div
                  key={role._id}
                  className="flex items-center justify-between p-3 bg-[#121212] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <div>
                      <h4 className="text-white font-medium">{role.name}</h4>
                      <p className="text-xs text-gray-400">
                        {Object.values(role.permissions).filter(Boolean).length} izin
                      </p>
                    </div>
                  </div>
                  
                  {!role.isDefault && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteRole(role._id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
