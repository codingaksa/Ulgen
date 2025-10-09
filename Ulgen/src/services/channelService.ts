// client/src/services/channelService.ts
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000/api";

export interface Channel {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  createdAt: string;
}

export interface CreateChannelData {
  name: string;
  description: string;
}

// Token'ı localStorage'dan al
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// API isteği yapmak için yardımcı fonksiyon
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Kullanıcının kanallarını getir
export const getChannels = async (): Promise<Channel[]> => {
  try {
    const data = await apiRequest("/channels");
    return data.channels || [];
  } catch (error) {
    console.error("Kanallar getirilirken hata:", error);
    // Mock data döndür (geliştirme için)
    return [
      {
        _id: "1",
        name: "Genel Sohbet",
        description: "Genel konuşmalar için kanal",
        owner: "user1",
        members: ["user1", "user2"],
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        name: "Oyun Kanalı",
        description: "Oyun oynarken kullanılan kanal",
        owner: "user1",
        members: ["user1", "user3"],
        createdAt: new Date().toISOString(),
      },
    ];
  }
};

// Yeni kanal oluştur
export const createChannel = async (
  channelData: CreateChannelData
): Promise<Channel> => {
  try {
    const data = await apiRequest("/channels", {
      method: "POST",
      body: JSON.stringify(channelData),
    });
    return data.channel;
  } catch (error) {
    console.error("Kanal oluşturulurken hata:", error);
    // Mock response döndür (geliştirme için)
    const newChannel: Channel = {
      _id: Date.now().toString(),
      name: channelData.name,
      description: channelData.description,
      owner: "current-user",
      members: ["current-user"],
      createdAt: new Date().toISOString(),
    };
    return newChannel;
  }
};

// Kanala katıl
export const joinChannel = async (channelId: string): Promise<void> => {
  try {
    await apiRequest(`/channels/${channelId}/join`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Kanala katılırken hata:", error);
    throw error;
  }
};

// Kanaldan ayrıl
export const leaveChannel = async (channelId: string): Promise<void> => {
  try {
    await apiRequest(`/channels/${channelId}/leave`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Kanaldan ayrılırken hata:", error);
    throw error;
  }
};

// Kanal detaylarını getir
export const getChannelDetails = async (
  channelId: string
): Promise<Channel> => {
  try {
    const data = await apiRequest(`/channels/${channelId}`);
    return data.channel;
  } catch (error) {
    console.error("Kanal detayları getirilirken hata:", error);
    throw error;
  }
};
