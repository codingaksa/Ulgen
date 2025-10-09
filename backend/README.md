# Ulgen Backend

This is the unified backend for the Ulgen app. It provides:

- Auth, Servers, Channels REST APIs under `/api/*`
- Invite management under `/api/invites`
- Socket.IO realtime for voice/presence on the same port

## Requirements

- Node.js 18+
- MongoDB running locally or a connection string

## Environment

Create a `.env` file in this folder using the following keys:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ulgen
# Single client URL or comma-separated list
CLIENT_URL=http://localhost:5173
# or
# CLIENT_URLS=http://localhost:5173,http://localhost:5174

JWT_SECRET=replace-with-a-secure-secret

# Email (optional for dev)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_LOGO_URL=https://via.placeholder.com/80x80/4a5568/ffffff?text=U
```

## Install & Run

```
# from backend/
npm install

# development
npm run dev

# production
npm start
```

The server will listen on `http://localhost:5000` by default and expose Socket.IO on the same origin.

## API Overview

- `POST /api/auth/register|login|logout|...`
- `GET /api/servers` `POST /api/servers`
- `GET /api/servers/:serverId/channels` `POST /api/servers/:serverId/channels`
- `PUT /api/servers/:serverId` `DELETE /api/servers/:serverId`
- `PUT /api/servers/:serverId/channels/:channelId` `DELETE /api/servers/:serverId/channels/:channelId`
- `POST /api/invites` `GET /api/invites?serverId=...` `DELETE /api/invites/:id`
- `GET /api/invites/:token` (verify) `POST /api/invites/:token/consume` (join)

## Realtime Events

- `join-channel`, `leave-channel`
- `presence-update` (username, isMuted, isDeafened, isSpeaking)
- `voice-data` (Float32 PCM frame + sampleRate)
