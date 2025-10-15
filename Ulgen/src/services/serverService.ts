export interface ServerItem {
  id: string;
  name: string;
  icon?: string | null;
}
export interface ChannelItem {
  id: string;
  name: string;
  description?: string;
  type?: string;
}

const API =
  (import.meta as any).env?.VITE_API_BASE ||
  "https://ulgen-backend.onrender.com/api";

export async function getServers(token: string): Promise<ServerItem[]> {
  const res = await fetch(`${API}/servers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Sunucular alınamadı");
  return data.servers.map((s: any) => ({
    id: s._id,
    name: s.name,
    icon: s.icon,
  }));
}

export async function createServer(
  token: string,
  name: string,
  icon?: string
): Promise<ServerItem> {
  const res = await fetch(`${API}/servers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, icon }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Sunucu oluşturulamadı");
  return {
    id: data.server._id,
    name: data.server.name,
    icon: data.server.icon,
  };
}

export async function getChannels(
  token: string,
  serverId: string
): Promise<ChannelItem[]> {
  const res = await fetch(`${API}/servers/${serverId}/channels`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Kanallar alınamadı");
  return data.channels.map((c: any) => ({
    id: c._id || c.id,
    name: c.name,
    description: c.description,
    type: c.type,
  }));
}

export async function createChannel(
  token: string,
  serverId: string,
  name: string,
  description?: string,
  type?: string
): Promise<ChannelItem> {
  const res = await fetch(`${API}/servers/${serverId}/channels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description, type }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Kanal oluşturulamadı");
  return {
    // Backend serverController.createChannel -> returns { channel: { id, name, description, type, server } }
    id: data.channel.id || data.channel._id,
    name: data.channel.name,
    description: data.channel.description,
    type: data.channel.type,
  };
}

export async function deleteServer(
  token: string,
  serverId: string
): Promise<void> {
  const res = await fetch(`${API}/servers/${serverId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).message || "Sunucu silinemedi");
  }
}

export async function updateServer(
  token: string,
  serverId: string,
  payload: { name?: string; icon?: string | null }
) {
  const res = await fetch(`${API}/servers/${serverId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Sunucu güncellenemedi");
  return {
    id: data.server._id,
    name: data.server.name,
    icon: data.server.icon,
  };
}

export async function updateChannelService(
  token: string,
  serverId: string,
  channelId: string,
  payload: { name?: string; description?: string }
) {
  const res = await fetch(`${API}/servers/${serverId}/channels/${channelId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Kanal güncellenemedi");
  return { id: data.channel._id, name: data.channel.name };
}

export async function deleteChannelService(
  token: string,
  serverId: string,
  channelId: string
) {
  const res = await fetch(`${API}/servers/${serverId}/channels/${channelId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).message || "Kanal silinemedi");
  }
}
