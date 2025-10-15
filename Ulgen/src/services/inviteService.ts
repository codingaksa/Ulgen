// client/src/services/inviteService.ts
// Backend tabanlı davet servis entegrasyonu (mock fallback ile)

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000/api";

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${API_BASE_URL}${url}`, config);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
};

export async function createInviteLink(
  serverId: string,
  opts?: {
    expiresInMs?: number;
    maxUses?: number;
    channelId?: string;
    inviteType?: "server" | "channel";
  }
): Promise<string> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const isLocalhost =
    typeof window !== "undefined" &&
    /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
  if (!serverId) return `${origin}/dashboard`;
  try {
    console.log('Creating invite for serverId:', serverId, 'opts:', opts);
    const data = await apiRequest("/invites", {
      method: "POST",
      body: JSON.stringify({ serverId, ...opts }),
    });
    console.log('Backend response:', data);
    const token: string = data?.token;
    if (!token) throw new Error("no token");
    const link = `${origin}/dashboard?inviteToken=${encodeURIComponent(token)}`;
    console.log('Generated invite link:', link);
    return link;
  } catch (error) {
    console.error('Failed to create invite via backend:', error);
    // Fallback: localStorage tabanlı token üret
    if (!isLocalhost) return `${origin}/dashboard`;
    try {
      const token =
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      const raw = localStorage.getItem("inviteTokens");
      const map = raw ? JSON.parse(raw) : {};
      const now = Date.now();
      const expiresInMs = opts?.expiresInMs ?? 3 * 24 * 60 * 60 * 1000; // 3 gün
      const maxUses = opts?.maxUses ?? 1; // tek kullanımlık varsayılan
      map[token] = {
        serverId,
        createdAt: now,
        expiresAt: now + expiresInMs,
        remainingUses: maxUses,
      };
      localStorage.setItem("inviteTokens", JSON.stringify(map));
      return `${origin}/dashboard?inviteToken=${encodeURIComponent(token)}`;
    } catch {
      return `${origin}/dashboard`;
    }
  }
}

export async function verifyInviteToken(
  inviteToken: string
): Promise<{ valid: boolean; serverId?: string }> {
  if (!inviteToken) return { valid: false };
  try {
    console.log('Verifying token:', inviteToken);
    // Sadece doğrulama yap, tüketme
    const data = await apiRequest(
      `/invites/${encodeURIComponent(inviteToken)}`
    );
    console.log('Verify response:', data);
    if (data?.valid && data?.serverId)
      return { valid: true, serverId: data.serverId };
    return { valid: false };
  } catch (error) {
    console.error('Verify token error:', error);
    const isLocalhost =
      typeof window !== "undefined" &&
      /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
    if (!isLocalhost) return { valid: false };
    try {
      const raw = localStorage.getItem("inviteTokens");
      const map = raw ? JSON.parse(raw) : {};
      const item = map[inviteToken];
      const now = Date.now();
      if (
        item &&
        item.serverId &&
        (item.expiresAt
          ? now < item.expiresAt
          : now - (item.createdAt || 0) < 7 * 24 * 60 * 60 * 1000) &&
        (item.remainingUses === undefined ? true : item.remainingUses > 0)
      ) {
        return { valid: true, serverId: item.serverId };
      }
      return { valid: false };
    } catch {
      return { valid: false };
    }
  }
}

export async function consumeInviteToken(
  inviteToken: string
): Promise<{ success: boolean; serverId?: string; channelId?: string }> {
  if (!inviteToken) return { success: false };
  try {
    console.log('Consuming token:', inviteToken);
    const data = await apiRequest(
      `/invites/${encodeURIComponent(inviteToken)}/consume`,
      { method: "POST" }
    );
    console.log('Consume response:', data);
    return {
      success: data?.success || false,
      serverId: data?.serverId,
      channelId: data?.channelId,
    };
  } catch (error) {
    console.error("Consume invite error:", error);
    return { success: false };
  }
}

export async function createChannelInviteLink(
  serverId: string,
  channelId: string,
  opts?: { expiresInMs?: number; maxUses?: number }
): Promise<string> {
  return createInviteLink(serverId, {
    ...opts,
    channelId,
    inviteType: "channel",
  });
}

export async function listInvites(serverId: string): Promise<
  Array<{
    id: string;
    serverId: string;
    createdAt: number;
    expiresAt: number | null;
    remainingUses: number;
  }>
> {
  if (!serverId) return [];
  const data = await apiRequest(
    `/invites?serverId=${encodeURIComponent(serverId)}`
  );
  return Array.isArray(data?.invites) ? data.invites : [];
}

export async function revokeInvite(inviteId: string): Promise<boolean> {
  if (!inviteId) return false;
  const res = await fetch(
    `${API_BASE_URL}/invites/${encodeURIComponent(inviteId)}`,
    { method: "DELETE" }
  );
  try {
    const data = await res.json();
    return !!data?.ok;
  } catch {
    return res.ok;
  }
}
